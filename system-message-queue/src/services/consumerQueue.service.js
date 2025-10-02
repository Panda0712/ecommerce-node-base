"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../db/init.rabbitmq");

const messageService = {
  consumerToQueue: async (queueName) => {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error("Error consumerToQueue::", error);
    }
  },

  // case processing
  consumerToQueueNormal: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationQueue = "notificationQueue";

      // const expiredTime = 15000;
      // setTimeout(() => {
      //   channel.consume(notificationQueue, (msg) => {
      //     console.log(
      //       "Sent notificationQueue successfully!!! message::: ",
      //       msg.content.toString()
      //     );
      //     channel.ack(msg);
      //   });
      // }, expiredTime);

      channel.consume(notificationQueue, (msg) => {
        try {
          const numberTest = Math.random();
          console.log(numberTest);
          if (numberTest < 0.8)
            throw new Error("Send notification failed:: HOT FIX!!!");

          console.log(
            "Sent notificationQueue successfully!!! message::: ",
            msg.content.toString()
          );
          channel.ack(msg);
        } catch (error) {
          channel.nack(msg, false, false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  },

  // case failed processing
  consumerToQueueFailed: async () => {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationExchangeDLX = "notificationExchangeDLX";
      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";
      const notificationQueueHandler = "notificationQueueHotFix";

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        durable: true,
      });

      const queueResult = await channel.assertQueue(notificationQueueHandler, {
        exclusive: false,
      });

      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );
      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            "This notification error, please hot fix:::",
            msgFailed.content.toString()
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = messageService;
