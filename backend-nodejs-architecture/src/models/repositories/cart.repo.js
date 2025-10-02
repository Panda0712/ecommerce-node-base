"use strict";

const cart = require("../cart.model");
const { ObjectId } = require("mongodb");

const findCartById = async (cartId) => {
  return await cart
    .findOne({
      _id: new ObjectId(String(cartId)),
      cart_state: "active",
    })
    .lean();
};

module.exports = {
  findCartById,
};
