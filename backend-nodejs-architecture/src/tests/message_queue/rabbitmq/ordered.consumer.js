"use strict";

const amqp = require("amqplib");

const consumerOrderedMessages = async () => {
  const connection = await amqp.connect("amqp://guest:guest@localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queue-messages";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // ensure only one ack at one time (ordered)
  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log("processed: ", message);
      channel.ack(msg);
    }, Math.random() * 1000);
  });

  setTimeout(() => {
    connection.close();
  }, 5000);
};

consumerOrderedMessages().catch((error) => console.error(error));
