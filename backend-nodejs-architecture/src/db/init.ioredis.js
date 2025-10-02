"use strict";

const Redis = require("ioredis");
const { RedisErrorResponse } = require("../utils/apiError");

let clients = {},
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
    console.log(`connectionIoRedis - Connection status: connected`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`connectionIoRedis - Connection status: disconnected`);

    // connect retry
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`connectionIoRedis - Connection status: reconnecting`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connectionIoRedis - Connection status: error ${err}`);

    // connect retry
    handleTimeoutError();
  });
};

const initIoRedis = async ({
  IOREDIS_IS_ENABLED,
  IOREDIS_HOST = process.env.REDIS_CACHE_HOST || "localhost",
  IOREDIS_PORT = 6379,
}) => {
  try {
    if (IOREDIS_IS_ENABLED) {
      const instanceRedis = new Redis({
        host: IOREDIS_HOST,
        port: IOREDIS_PORT,
      });

      clients.instanceConnect = instanceRedis;
      handleEventConnection({ connectionRedis: instanceRedis });

      // Actually connect to Redis
      // await instanceRedis.connect();

      console.log("Redis clients initialized and connected successfully");
    }
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
  }
};

const getIoRedis = () => clients;

const closeIoRedis = async () => {
  try {
    if (clients.instanceConnect) {
      await clients.instanceConnect.disconnect();
      console.log("Redis connection closed");
    }
  } catch (error) {
    console.error("Error closing Redis connection:", error);
  }
};

module.exports = {
  handleTimeoutError,
  handleEventConnection,
  initIoRedis,
  getIoRedis,
  closeIoRedis,
};
