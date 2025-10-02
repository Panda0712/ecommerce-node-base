"use strict";

const keyTokenModel = require("../models/keytoken.model");
const { ObjectId } = require("mongodb");

class KeyTokenService {
  static createKeyToken = async ({ shopId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        shop: shopId,
        publicKey: publicKeyString,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static createKeyTokenV2 = async ({
    shopId,
    publicKey,
    privateKey,
    refreshToken = null,
  }) => {
    try {
      // level 0
      // const tokens = await keyTokenModelV2.create({
      //   shop: shopId,
      //   publicKey,
      //   privateKey,
      // });

      // level xxx
      const filter = {
          shop: shopId,
        },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = {
          upsert: true,
          new: true,
        };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByShopId = async (shopId) => {
    return await keyTokenModel
      .findOne({ shop: new ObjectId(String(shopId)) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: new ObjectId(String(id)) });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static deleteKeyById = async (shopId) => {
    return await keyTokenModel.findOneAndDelete({ shop: shopId });
  };
}

module.exports = KeyTokenService;
