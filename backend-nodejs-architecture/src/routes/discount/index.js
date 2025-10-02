"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const discountController = require("../../controllers/discount.controller");
const { authenticationV2 } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/amount", asyncHandler(discountController.getDiscountAmount));

// middleware
router.use(authenticationV2);

router.post("", asyncHandler(discountController.createDiscountCode));
router.get(
  "/list_product_code",
  asyncHandler(discountController.getAllDiscountCodesWithProduct)
);
router.get("", asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;
