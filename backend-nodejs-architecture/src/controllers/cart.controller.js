"use strict";

const CartService = require("../services/cart.service");
const { SuccessResponse } = require("../utils/apiSuccess");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Created new cart successfully!",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Updated cart successfully!",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  deleteCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Deleted cart successfully!",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  getListCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list cart successfully!",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
