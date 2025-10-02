"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000;

// count number of connections to mongodb
const countConnect = () => {
  const numConnections = mongoose.connections.length;
  console.log(`Number of connections now: ${numConnections}`);
};

// check overload connects
const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // maximum connections based on number of cores
    const maxConnections = numCores * 5;

    console.log(`Num connections: ${numConnections}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024}MB`);

    if (numConnections > maxConnections) {
      console.log("Overload connections detected!");
    }
  }, _SECONDS); // monitor per 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
