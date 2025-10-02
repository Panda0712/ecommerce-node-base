"use strict";

const _ = require("lodash");
const SKU = require("../models/sku.model");
const { randomProductId } = require("../utils/helpers");
const { CACHE_PRODUCT } = require("../utils/constants");
const {
  getCacheIO,
  setCacheIOExpiration,
} = require("../models/repositories/cache.repo");

const newSku = async ({ spu_id, sku_list }) => {
  try {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${spu_id}.${randomProductId()}`,
      };
    });

    const skus = await SKU.create(convert_sku_list);
    return skus;
  } catch (error) {
    return [];
  }
};

const oneSku = async ({ sku_id, product_id }) => {
  try {
    // check params
    if (sku_id < 0) return null;
    if (product_id < 0) return null;

    // read cache
    const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}`;
    // let skuCache = await getCacheIO({
    //   key: skuKeyCache,
    // });
    // if (skuCache) {
    //   return {
    //     ...JSON.parse(skuCache),
    //     toLoad: "cache",
    //   };
    // }

    // read from dbs
    // if (!skuCache) {
    const skuCache = await SKU.findOne({
      sku_id,
      product_id,
    }).lean();

    const valueCache = skuCache ? skuCache : null;

    setCacheIOExpiration({
      key: skuKeyCache,
      value: JSON.stringify(valueCache),
      expirationInSeconds: 30,
    }).then();
    // }

    return {
      skuCache,
      toLoad: "dbs",
    };
  } catch (error) {
    return null;
  }
};

const allSkuBySpuId = async ({ product_id }) => {
  try {
    // 1. spu_id
    const skus = await SKU.find({
      product_id,
    }).lean();

    return skus;
  } catch (error) {
    return null;
  }
};

module.exports = {
  newSku,
  oneSku,
  allSkuBySpuId,
};
