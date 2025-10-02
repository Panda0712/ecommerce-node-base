"use strict";

const ProductService = require("../services/product.service.xxx");
const { oneSku } = require("../services/sku.service");
const { newSpu, oneSpu } = require("../services/spu.service");
const { SuccessResponse } = require("../utils/apiSuccess");

class ProductController {
  findOneSpu = async (req, res, next) => {
    try {
      const { product_id } = req.query;
      new SuccessResponse({
        message: "product one",
        metadata: await oneSpu({ spu_id: product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  findOneSku = async (req, res, next) => {
    try {
      const { sku_id, product_id } = req.query;
      new SuccessResponse({
        message: "Get sku one",
        metadata: await oneSku({ sku_id, product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createSpu = async (req, res, next) => {
    try {
      const spu = await newSpu({
        ...req.body,
        product_shop: req.user.shopId,
      });
      new SuccessResponse({
        message: "Success created spu",
        metadata: spu,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Created new product successfully!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.shopId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Updated product successfully!",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.shopId,
        }
      ),
    }).send(res);
  };

  /**
   * @desc get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  findAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get drafts list successfully!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.shopId,
      }),
    }).send(res);
  };

  /**
   * @desc get all published for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  findAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get published list successfully!",
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.shopId,
      }),
    }).send(res);
  };

  publishedProductForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Published product successfully!",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.shopId,
        product_id: req.params.productId,
      }),
    }).send(res);
  };

  unpublishedProductForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublished product successfully!",
      metadata: await ProductService.unpublishProductByShop({
        product_shop: req.user.shopId,
        product_id: req.params.productId,
      }),
    }).send(res);
  };

  searchProductByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Searched products successfully!",
      metadata: await ProductService.searchProductByUser(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Found all products successfully!",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Found product successfully!",
      metadata: await ProductService.findProduct({
        productId: req.params.productId,
        unselect: req.query?.unselect,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
