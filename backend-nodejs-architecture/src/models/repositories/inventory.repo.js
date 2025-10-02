"use strict";

const { ObjectId } = require("mongodb");
const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventoryModel.create({
    inventory_productId: new ObjectId(String(productId)),
    inventory_stock: stock,
    inventory_location: location,
    inventory_shopId: new ObjectId(String(shopId)),
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inventory_productId: new ObjectId(String(productId)),
      inventory_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inventory_stock: -quantity,
      },
      $push: {
        inventory_reservations: {
          quantity,
          cartId,
          createdOn: new Date(),
        },
      },
    },
    options = {
      upsert: true,
      new: true,
    };

  return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
