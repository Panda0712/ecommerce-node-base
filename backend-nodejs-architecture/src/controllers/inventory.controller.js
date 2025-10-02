"use strict";

const InventoryService = require("../services/inventory,service");
const { SuccessResponse } = require("../utils/apiSuccess");

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: "Created new inventory successfully!!",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
