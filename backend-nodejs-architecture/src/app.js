const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { countConnect, checkOverload } = require("./helpers/check.connect");
const { v4: uuidV4 } = require("uuid");
const myLogger = require("./loggers/mylogger.log");

const app = express();

// init middleware
// config log types
app.use(morgan("dev"));
// prevent attack by hiding important header information
app.use(helmet());
// reduce bundle size of sending requests
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
// app.use(morgan("combined"));
// app.use(morgan("common"));
// app.use(morgan("short"));
// app.use(morgan("tiny"));

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId ? requestId : uuidV4();

  myLogger.log(`input params ::${req.method}::`, [
    req.path,
    {
      requestId: req.requestId,
      ...(req.method === "POST" ? req.body : req.query),
    },
  ]);

  next();
});

// test pub sub redis
// async function initRedisPubSub() {
//   try {
//     // Initialize inventory service first (subscriber)
//     const InventoryTestService = require("./tests/inventory.test");
//     new InventoryTestService();

//     // Wait a bit for subscription to be established
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Then test the product service (publisher)
//     const productTest = require("./tests/product.test");
//     await productTest.purchaseProduct("product:001", 10);

//     console.log("Redis pub/sub services initialized successfully");
//   } catch (error) {
//     console.error("Error initializing Redis pub/sub services:", error);
//   }
// }
// initRedisPubSub();

// init database
require("./db/init.mongodb");

// Initialize Redis asynchronously
const initializeRedis = async () => {
  try {
    const { initRedis } = require("./db/init.redis");
    await initRedis();
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
  }
};

// Call Redis initialization
initializeRedis();

// init elastic search
const initElasticSearch = require("./db/init.elasticsearch");
initElasticSearch.initElastic({
  ELASTICSEARCH_IS_ENABLED: true,
});

// ioredis
const ioRedis = require("./db/init.ioredis");
ioRedis.initIoRedis({
  IOREDIS_IS_ENABLED: true,
});

countConnect();
// checkOverload();

// init routes
app.use("/", require("./routes"));

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const resMessage = `${err.status} - ${
    Date.now
  }ms - Response: ${JSON.stringify(err)}`;
  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: err.message },
  ]);
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: err.stack,
    message: err.message || "Internal server error!",
  });
});

module.exports = app;
