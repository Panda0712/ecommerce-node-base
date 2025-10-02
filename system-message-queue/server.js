"use strict";

const {
  consumerToQueue,
  consumerToQueueNormal,
  consumerToQueueFailed,
} = require("./src/services/consumerQueue.service");
const queueName = "test-topic";

// consumerToQueue(queueName)
//   .then(() => {
//     console.log("Message consumer started: ", queueName);
//   })
//   .catch((error) => {
//     console.error("Message error: ", error.message);
//   });

consumerToQueueNormal()
  .then(() => {
    console.log("Message consumerToQueueNormal started!!!");
  })
  .catch((error) => {
    console.error("Message error: ", error.message);
  });

consumerToQueueFailed()
  .then(() => {
    console.log("Message consumerToQueueFailed started!!!");
  })
  .catch((error) => {
    console.error("Message error: ", error.message);
  });
