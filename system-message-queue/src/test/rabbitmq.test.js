"use strict";

const { connectToRabbitMQTest } = require("../db/init.rabbitmq");

describe("RabbitMQ connection", () => {
  it("should connect successfully to RabbitMQ", async () => {
    const result = await connectToRabbitMQTest();
    expect(result).toBeUndefined();
  });
});
