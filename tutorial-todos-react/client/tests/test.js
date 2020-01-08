import assert from "assert";

describe("tutorial-todos-react", function () {
  it("client is not server", function () {
    assert.strictEqual(Meteor.isServer, false);
  });
});
