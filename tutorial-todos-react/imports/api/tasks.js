import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Tasks = new Mongo.Collection('tasks');

function checkLoggedIn() {
  if (!this.userId) {
    throw new Meteor.Error('not-authorized');
  }
}

function checkOwner(task) {
  if (task.owner !== this.userId) {
    throw new Meteor.Error('not-authorized');
  }
}

function checkPrivateOwner(task) {
  if (task.private) {
    checkOwner.call(this, task);
  }
}

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    // Make sure only logged in users can create tasks
    checkLoggedIn.call(this);
 
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    // Make sure only the task owner can delete their tasks
    checkOwner.call(this, Tasks.findOne(taskId));
 
    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    // Make sure only logged in users can check tasks
    checkLoggedIn.call(this);
    
    // If the task is private, make sure only the owner can check it off
    checkPrivateOwner.call(this, Tasks.findOne(taskId));
 
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
 
    // Make sure only the task owner can make a task private
    checkOwner.call(this, Tasks.findOne(taskId));
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});