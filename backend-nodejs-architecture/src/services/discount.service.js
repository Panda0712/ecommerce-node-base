"use strict";

const { BadRequestError, NotFoundError } = require("../utils/apiError");
const discount = require("../models/discount.model");
const { ObjectId } = require("mongodb");
const { findAllProducts } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodeUnselect,
  checkDiscountExistence,
} = require("../models/repositories/discount.repo");

class DiscountService {
  static async createDiscount(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      used_count,
      users_used,
      max_uses_per_user,
    } = payload;

    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Invalid discount date!");
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("Invalid discount date!");
    }

    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: new ObjectId(String(shopId)),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount already exists!");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_uses: max_uses,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_used_count: used_count,
      discount_users_used: users_used,
      discount_shopId: new ObjectId(String(shopId)),
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  static async getAllDiscountCodeWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: new ObjectId(String(shopId)),
      })
      .lean();

    if (!foundDiscount && !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;

    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: {
          product_shop: new ObjectId(String(shopId)),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: new ObjectId(String(shopId)),
        discount_is_active: true,
      },
      unselect: ["__v", "discount_shopId"],
      model: discount,
    });

    return discounts;
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExistence({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: new ObjectId(String(shopId)),
      },
    });
    if (!foundDiscount) throw new NotFoundError("Discount doesn't exist!");

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_type,
      discount_value,
      discount_min_order_value,
      discount_users_used,
    } = foundDiscount;

    if (!discount_is_active) throw BadRequestError("Discount expired!");
    if (!discount_max_uses)
      throw new BadRequestError("Discount ran out of max used!");

    if (
      new Date() > new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount expired!");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((total, product) => {
        return total + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          "Your amount doesn't reach the min order value!"
        );
      }
    }

    if (discount.max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userDiscount) {
        //.....
      }
    }

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : (totalOrder * discount_value) / 100;

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
  static async deleteDiscount({ shopId, codeId }) {
    const deletedDiscount = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: new ObjectId(String(shopId)),
    });
    return deletedDiscount;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExistence({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: new ObjectId(String(shopId)),
      },
    });
    if (!foundDiscount) throw new NotFoundError("Discount not found!");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_used_count: -1,
      },
    });
    return result;
  }
}

module.exports = DiscountService;
