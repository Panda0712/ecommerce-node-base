"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    if (!connection) throw new Error("Connection not established!!!");

    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (error) {
    console.error("Error connecting to rabbitMQ", error);
    throw error;
  }
};

const connectToRabbitMQTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    // Publish message to a queue
    const queue = "test-queue";
    const message = "Hello, RabbitMQ here!!!";
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(message));

    // close the connection
    await connection.close();
  } catch (error) {
    console.error("Error testing connect to rabbitMQ", error);
    throw error;
  }
};

const consumerQueue = async (channel, queueName) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    console.log("Waiting for message::....");

    channel.consume(
      queueName,
      (msg) => {
        console.log(
          `Received messages:: ${queueName}::`,
          msg.content.toString()
        );
        // 1. find user following SHOP
        // 2. send messages to user
        // 3. yes, ok => success
        // 4. error, setup DLX
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.error("Error publishing messages to rabbitMQ", error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQTest,
  consumerQueue,
};
