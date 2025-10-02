"use strict";

const redis = require("redis");
const { RedisErrorResponse } = require("../utils/apiError");

let client = {},
  statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  },
  connectionTimeout;

const REDIS_CONNECT_TIMEOUT = 10000;
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: {
    vn: "Redis loi roi anh em oi!!!",
    en: "service connection error!!!",
  },
};

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse({
      message: REDIS_CONNECT_MESSAGE.message.en,
      statusCode: REDIS_CONNECT_MESSAGE.code,
    });
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnection = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`connectionRedis - Connection status: connected`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`connectionRedis - Connection status: disconnected`);

    // connect retry
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`connectionRedis - Connection status: reconnecting`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connectionRedis - Connection status: error ${err}`);

    // connect retry
    handleTimeoutError();
  });
};

const initRedis = async () => {
  try {
    const instanceRedis = redis.createClient({
      // Add your Redis configuration here if needed
      // host: 'localhost',
      // port: 6379,
      // password: 'your-password', // if you have authentication
    });

    client.instanceConnect = instanceRedis;
    handleEventConnection({ connectionRedis: instanceRedis });

    // Actually connect to Redis
    await instanceRedis.connect();

    console.log("Redis client initialized and connected successfully");
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
  }
};

const getRedis = () => client;

const closeRedis = async () => {
  try {
    if (client.instanceConnect) {
      await client.instanceConnect.disconnect();
      console.log("Redis connection closed");
    }
  } catch (error) {
    console.error("Error closing Redis connection:", error);
  }
};

module.exports = {
  handleTimeoutError,
  handleEventConnection,
  initRedis,
  getRedis,
  closeRedis,
};
