const amqp = require("amqplib");

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const notificationExchange = "notificationEx";
    const notificationQueue = "notificationQueue";
    const notificationExchangeDLX = "notificationExchangeDLX";
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

    // 1. create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    // 2. create queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // allow connections to access queues at the same time
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3. bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. send messages
    const msg = "a new product";
    console.log("product msg:::", msg);
    channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: "10000",
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (err) {
    console.error(err);
  }
};

runProducer().catch(console.error);
