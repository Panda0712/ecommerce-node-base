"use strict";

const express = require("express");
const inventoryController = require("../../controllers/inventory.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../middlewares/authMiddleware");

const router = express.Router();

// middleware
router.use(authenticationV2);

// create inventory
router.post("/", asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
