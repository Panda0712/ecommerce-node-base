"use strict";

const Shop = require("../shop.model");

const selectStruct = {
  email: 1,
  name: 1,
  status: 1,
  roles: 1,
};

const findShopById = async ({ shop_id, select = selectStruct }) => {
  return await Shop.findById(shop_id).select(select);
};

module.exports = {
  findShopById,
};
