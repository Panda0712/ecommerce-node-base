"use strict";

const CheckoutService = require("../services/checkout.service");
const { SuccessResponse } = require("../utils/apiSuccess");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Created checkout successfully!!",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  };
}

module.exports = new CheckoutController();
