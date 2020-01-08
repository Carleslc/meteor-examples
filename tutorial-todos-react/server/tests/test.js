import assert from "assert";

import "./tasks.test.js";

describe("tutorial-todos-react", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../../package.json");
    assert.strictEqual(name, "tutorial-todos-react");
  });

  it("server is not client", function () {
    assert.strictEqual(Meteor.isClient, false);
  });
});
