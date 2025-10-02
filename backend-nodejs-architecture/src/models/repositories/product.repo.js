"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../../models/product.model");
const { ObjectId } = require("mongodb");
const { getSelectData, getUnselectedData } = require("../../utils/helpers");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new ObjectId(String(product_shop)),
    _id: new ObjectId(String(product_id)),
  });
  if (!foundShop) return null;

  const updatedShop = await product.findOneAndUpdate(
    {
      _id: new ObjectId(String(product_id)),
    },
    {
      $set: {
        isDraft: false,
        isPublished: true,
      },
    }
  );

  return updatedShop;
};

const unpublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new ObjectId(String(product_shop)),
    _id: new ObjectId(String(product_id)),
  });
  if (!foundShop) return null;

  const updatedShop = await product.findOneAndUpdate(
    {
      _id: new ObjectId(String(product_id)),
    },
    {
      $set: {
        isDraft: true,
        isPublished: false,
      },
    }
  );

  return updatedShop;
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isDraft: false,
        isPublished: true,
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .sort({
      score: { $meta: "textScore" },
    })
    .lean();

  return results;
};

const findAllProducts = async ({ limit, sort, filter, page, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async (id, unselect) => {
  const foundProduct = await product
    .findById(id)
    .select(getUnselectedData(unselect));
  if (!foundProduct) return null;

  return foundProduct;
};

const updateProductById = async (
  productId,
  updateData,
  model,
  isNew = true
) => {
  const updatedProduct = await model.findByIdAndUpdate(productId, updateData, {
    new: isNew,
  });
  return updatedProduct;
};

const getProductById = async (productId) => {
  return await product.findOne({
    _id: new ObjectId(String(productId)),
  });
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unpublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer,
};
