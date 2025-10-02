const amqp = require("amqplib");
const messages = "Hello, RabbitMQ for everyone!";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // send messages to consumer channel
    channel.sendToQueue(queueName, Buffer.from(messages));
    console.log(`message sent: `, messages);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.error(err);
  }
};

runProducer().catch(console.error);
