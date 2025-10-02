"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  unpublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { BadRequestError } = require("../utils/apiError");
const {
  removeUndefinedObject,
  updateNestedObjectParser,
} = require("../utils/helpers");
const { pushNotificationsToSystem } = require("./notification.service");

// define Factory class to create product
class ProductFactory {
  // type: Electronic, Clothing
  // payload
  static productRegistry = {};

  static registerProductType(type, productClass) {
    ProductFactory.productRegistry[type] = productClass;
  }

  static createProduct(type, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);

    return new productClass(payload).createProduct();
  }

  static updateProduct(type, productId, payload) {
    const productClass = this.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type: ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  // query product based on isDraft
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };

    return await findAllDraftsForShop({ query, skip, limit });
  }

  // query product based on isPublished
  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };

    return await findAllPublishedForShop({ query, skip, limit });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id });
  }

  static async searchProductByUser({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
    select,
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: select?.length
        ? select
        : ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ productId, unselect }) {
    return await findProduct(
      productId,
      (unselect = unselect?.length ? unselect : ["__v"])
    );
  }
}

// define based structure for product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }

  async createProduct(productId) {
    const newProduct = await product.create({
      ...this,
      _id: productId,
    });
    if (newProduct)
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });

    // push notification to system collection
    pushNotificationsToSystem({
      type: "SHOP-001",
      receivedId: 1,
      senderId: this.product_shop,
      options: {
        product_name: this.product_name,
        product_shop: this.product_shop,
      },
    })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));

    return newProduct;
  }

  async updateProduct(productId, updateData) {
    return await updateProductById(productId, updateData, product);
  }
}

// define sub-class for different product types: Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing)
      throw new BadRequestError("Errored while creating new clothes!");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct)
      throw new BadRequestError("Errored while creating new product!");

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      // update child
      await updateProductById(
        productId,
        updateNestedObjectParser(objectParams.product_attributes),
        clothing
      );
    }

    const updatedProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updatedProduct;
  }
}

// define sub-class for different product types: Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Errored while creating new electronic!");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct)
      throw new BadRequestError("Errored while creating new product!");

    return newProduct;
  }
}

// define sub-class for different product types: Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture)
      throw new BadRequestError("Errored while creating new furniture!");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct)
      throw new BadRequestError("Errored while creating new product!");

    return newProduct;
  }
}

// register product class
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
