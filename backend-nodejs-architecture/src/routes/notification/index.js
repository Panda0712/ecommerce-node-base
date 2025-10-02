"use strict";

const express = require("express");
const notificationController = require("../../controllers/notification.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../middlewares/authMiddleware");

const router = express.Router();

// FOR UNAUTHORIZED USER

// authentication
router.use(authenticationV2);

// FOR AUTHORIZED USER
router.get("/", asyncHandler(notificationController.getNotificationsByUser));

module.exports = router;
