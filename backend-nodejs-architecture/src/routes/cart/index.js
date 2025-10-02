"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("", asyncHandler(cartController.addToCart));
router.delete("", asyncHandler(cartController.deleteCart));
router.post("/update", asyncHandler(cartController.updateCart));
router.get("", asyncHandler(cartController.getListCart));

module.exports = router;
