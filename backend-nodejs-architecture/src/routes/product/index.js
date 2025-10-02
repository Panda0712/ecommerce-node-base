"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const productController = require("../../controllers/product.controller");
const { authenticationV2 } = require("../../middlewares/authMiddleware");
const { readCache } = require("../../middlewares/cache.middleware");

const router = express.Router();

// search product
router.get(
  "/search/:keySearch",
  asyncHandler(productController.searchProductByUser)
);
router.get("/sku", readCache, asyncHandler(productController.findOneSku));
router.get("/spu", asyncHandler(productController.findOneSpu));
router.get("/", asyncHandler(productController.findAllProducts));
router.get("/:productId", asyncHandler(productController.findProduct));

// middleware
router.use(authenticationV2);

// create product
router.post("/", asyncHandler(productController.createProduct));
router.post("/new_spu", asyncHandler(productController.createSpu));
router.post(
  "/:productId",
  asyncHandler(productController.publishedProductForShop)
);
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.post(
  "/unpublish/:productId",
  asyncHandler(productController.unpublishedProductForShop)
);

router.get("/drafts/all", asyncHandler(productController.findAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.findAllPublishedForShop)
);

module.exports = router;
