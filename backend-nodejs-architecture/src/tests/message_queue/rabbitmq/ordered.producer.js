"use strict";

const amqp = require("amqplib");

const producerOrderedMessages = async () => {
  const connection = await amqp.connect("amqp://guest:guest@localhost");
  const channel = await connection.createChannel();

  const queueName = "ordered-queue-messages";
  await channel.assertQueue(queueName, {
    durable: true,
  });

  for (let i = 0; i < 10; i++) {
    const message = `ordered-queue-messages::${i}`;
    console.log("message:: ", message);
    channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
  }

  setTimeout(() => {
    connection.close();
  }, 5000);
};

producerOrderedMessages().catch((error) => console.error(error));
