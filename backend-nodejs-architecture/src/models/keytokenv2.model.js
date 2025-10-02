"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "KeyV2";
const COLLECTION_NAME = "KeyV2s";

// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
