"use strict";

const { listNotificationsByUser } = require("../services/notification.service");
const { SuccessResponse } = require("../utils/apiSuccess");

class NotificationController {
  getNotificationsByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get notifications successfully!!",
      metadata: await listNotificationsByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();
