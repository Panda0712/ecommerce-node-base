const amqp = require("amqplib");

const runConsumer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:123456@localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // send messages to consumer channel
    channel.consume(
      queueName,
      (messages) => {
        console.log(`Received message: ${messages.content.toString()}`);
      },
      {
        noAck: true,
      }
    );
    console.log("Messages received successfully!");
  } catch (err) {
    console.error(err);
  }
};

runConsumer().catch(console.error);
