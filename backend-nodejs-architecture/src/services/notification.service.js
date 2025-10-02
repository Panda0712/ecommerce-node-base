"use strict";

const notification = require("../models/notification.model");

const pushNotificationsToSystem = async ({
  type = "SHOP-001",
  receivedId = 1,
  senderId = 1,
  options = {},
}) => {
  let notification_content;

  if (type === "SHOP-001") {
    notification_content = "@@@ has added new product: @@@@";
  } else if (type === "PROMOTION-001") {
    notification_content = "@@@ has added new voucher: @@@@";
  }

  const newNotification = await notification.create({
    notification_type: type,
    notification_content,
    notification_senderId: senderId,
    notification_receivedId: receivedId,
    notification_options: options,
  });

  return newNotification;
};

const listNotificationsByUser = async ({
  userId = 1,
  type = "ALL",
  isRead = 0,
}) => {
  const match = {
    notification_receivedId: Number(userId),
  };
  if (type !== "ALL") match["notification_type"] = type;

  return await notification.aggregate([
    {
      $match: match,
    },
    {
      $project: {
        notification_type: 1,
        notification_senderId: 1,
        notification_receivedId: 1,
        notification_content: {
          $concat: [
            {
              $substr: ["$notification_options.product_shop", 0, -1],
            },
            " vừa mới thêm 1 sản phẩm mới: ",
            {
              $substr: ["$notification_options.product_name", 0, -1],
            },
          ],
        },
        notification_options: 1,
        createdAt: 1,
      },
    },
  ]);
};

module.exports = {
  pushNotificationsToSystem,
  listNotificationsByUser,
};
