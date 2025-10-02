"use strict";

const express = require("express");
const apiKey = require("../middlewares/apiKeyMiddleware");
const permission = require("../middlewares/permissionMiddleware");
const { pushToDiscordLog } = require("../middlewares/loggerMiddleware");

const router = express.Router();

// test
router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome to Backend NodeJS Architecture!",
  });
});

// add log to discord
router.use(pushToDiscordLog);

// check api key
router.use(apiKey);

// check permissions
router.use(permission("0000"));

router.use("/v1/api/product", require("./product"));
router.use("/v1/api/email", require("./email"));
router.use("/v1/api/user", require("./user"));
router.use("/v1/api/rbac", require("./rbac"));
router.use("/v1/api/profile", require("./profile"));
router.use("/v1/api/upload", require("./upload"));
router.use("/v1/api/comment", require("./comment"));
router.use("/v1/api/notification", require("./notification"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api", require("./auth"));

module.exports = router;
