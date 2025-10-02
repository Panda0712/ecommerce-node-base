"use strict";

const { Schema, default: mongoose } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// ORDER-001: ORDER SUCCESSFULLY
// ORDER-002: ORDER FAILED
// PROMOTION-001: NEW PROMOTION
// SHOP-001: NEW PRODUCT BY USER FOLLOWING

const notificationSchema = new Schema(
  {
    notification_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      required: true,
    },
    notification_senderId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    notification_receivedId: {
      type: Number,
      required: true,
    },
    notification_content: {
      type: String,
      required: true,
    },
    notification_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);
