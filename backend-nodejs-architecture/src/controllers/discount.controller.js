"use strict";

const DiscountService = require("../services/discount.service");
const { SuccessResponse } = require("../utils/apiSuccess");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Created discount successfully!",
      metadata: await DiscountService.createDiscount({
        ...req.body,
        shopId: req.user.shopId,
      }),
    }).send(res);
  };

  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount codes successfully!",
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.shopId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount amount successfully!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount codes with product successfully!",
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
        shopId: req.user.shopId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
