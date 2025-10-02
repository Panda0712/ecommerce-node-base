"use strict";

const mongoose = require("mongoose");
const connectionString = "mongodb://localhost:27017/shopDEV";

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("Test", TestSchema);

describe("Mongoose connection", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectionString);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it("should connect successfully to mongoose", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("should save a test document to database", async () => {
    const user = new Test({ name: "Panda" });
    await user.save();
    expect(user.isNew).toBe(false);
  });

  it("should find a document in database", async () => {
    const user = await Test.findOne({ name: "Panda" });
    expect(user).toBeDefined();
    expect(user.name).toBe("Panda");
  });
});
