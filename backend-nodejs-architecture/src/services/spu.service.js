"use strict";

const { findShopById } = require("../models/repositories/shop.repo");
const { NotFoundError } = require("../utils/apiError");
const SPU = require("../models/spu.model");
const { randomProductId } = require("../utils/helpers");
const { newSku, allSkuBySpuId } = require("./sku.service");
const _ = require("lodash");

const newSpu = async ({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_type,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = [],
}) => {
  try {
    // 1. check if shop exists
    const foundShop = await findShopById({
      shop_id: product_shop,
    });
    if (!foundShop) throw new NotFoundError("Shop not found!!!");

    // 2. create a new spu
    const spu = await SPU.create({
      product_id: randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_type,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
    });

    // 3. get spu_id and to sku.service
    if (spu && sku_list.length) {
      // create skus
      newSku({ sku_list, spu_id: spu.product_id }).then();
    }

    // 4. sync data via elastic search

    // 5. respond result object
    return !!spu;
  } catch (error) {
    console.error(error);
  }
};

const oneSpu = async ({ spu_id }) => {
  try {
    const spu = await SPU.findOne({
      product_id: spu_id,
      isPublished: false,
    });
    if (!spu) throw new NotFoundError("Spu not found!!");

    const skus = await allSkuBySpuId({ product_id: spu.product_id });

    return {
      spu_info: _.omit(spu, ["__v", "updatedAt"]),
      sku_list: skus.map((sku) =>
        _.omit(sku, ["__v", "updatedAt", "createdAt", "isDeleted"])
      ),
    };
  } catch (error) {
    return {};
  }
};

module.exports = {
  newSpu,
  oneSpu,
};
