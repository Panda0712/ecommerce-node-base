"use strict";

const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");
const { BadRequestError } = require("../utils/apiError");

class InventoryService {
  static async addStockToInventory({ stock, productId, shopId, location }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("Product does not exists!");

    const query = {
        inventory_shopId: shopId,
        inventory_productId: productId,
      },
      updateSet = {
        $inc: {
          inventory_stock: stock,
        },
        $set: {
          inventory_location: location,
        },
      },
      options = {
        upsert: true,
        new: true,
      };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
