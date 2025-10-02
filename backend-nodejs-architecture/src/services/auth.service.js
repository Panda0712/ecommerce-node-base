"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { SHOP_ROLES } = require("../utils/constants");
const KeyTokenService = require("./keyToken.service");
const {
  createTokenPair,
  createTokenPairV2,
  verifyToken,
} = require("../utils/auth");
const { getInfoData } = require("../utils/helpers");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../utils/apiError");
const { findByEmail } = require("./shop.service");
const keytokenModel = require("../models/keytoken.model");

class AuthService {
  static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { shopId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(shopId);
      throw new ForbiddenError("Something wrong happened! Please login again!");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop not registered!");
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered!");

    const tokens = await createTokenPairV2(
      {
        shopId,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keytokenModel.findOneAndUpdate(
      { _id: keyStore._id },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );

    return {
      shop: { shopId, email },
      tokens,
    };
  };

  static handleRefreshToken = async (refreshToken) => {
    // check the token existence
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { shopId, email } = await verifyToken(
        refreshToken,
        foundToken.privateKey
      );
      console.log(shopId, email);
      await KeyTokenService.deleteKeyById(shopId);
      throw new ForbiddenError("Something wrong happened! Please login again!");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError("Shop not registered!");
    }

    const { shopId, email } = await verifyToken(
      holderToken.refreshToken,
      holderToken.privateKey
    );

    console.log("[2] --- ", shopId, email);

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered!");

    const tokens = await createTokenPairV2(
      {
        shopId,
        email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );

    await keytokenModel.findOneAndUpdate(
      { _id: holderToken._id },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokensUsed: refreshToken,
        },
      }
    );

    return {
      shop: { shopId, email },
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);

    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const shop = await findByEmail({ email });
    if (!shop) throw new BadRequestError("Shop not registered!");

    const matchedPassword = await bcrypt.compare(password, shop.password);
    if (!matchedPassword) throw new AuthFailureError("Authentication error!");

    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPairV2(
      {
        shopId: shop._id,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyTokenV2({
      shopId: shop._id,
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
    });

    return {
      shop: getInfoData({
        fields: ["email", "name", "_id"],
        object: shop,
      }),
      tokens,
    };
  };

  static signUp = async ({ email, name, password }) => {
    try {
      // check user existence
      const shopCheck = await shopModel.findOne({ email }).lean();
      if (shopCheck) {
        throw new BadRequestError("Error: Shop already registered!", 400);
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create shop
      const newShop = await shopModel.create({
        email,
        name,
        password: hashedPassword,
        roles: [SHOP_ROLES.SHOP],
      });

      // generate access token and refresh token
      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        console.log({ publicKey, privateKey });

        const publicKeyString = await KeyTokenService.createKeyToken({
          shopId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }
        console.log("Public key string", publicKeyString);
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log("Public key object::", publicKeyObject);

        // create access and refresh token
        const tokens = await createTokenPair(
          {
            shopId: newShop._id,
            email,
          },
          publicKeyObject,
          privateKey
        );
        console.log("Successfully created the tokens::", tokens);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["email", "name", "_id"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };

  static signUpV2 = async ({ email, name, password }) => {
    try {
      // check user existence
      const shopCheck = await shopModel.findOne({ email }).lean();
      if (shopCheck) {
        return {
          code: "xxxx",
          message: "Shop already registered!",
        };
      }

      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create shop
      const newShop = await shopModel.create({
        email,
        name,
        password: hashedPassword,
        roles: [SHOP_ROLES.SHOP],
      });

      // generate access token and refresh token
      if (newShop) {
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        console.log({ publicKey, privateKey });

        const keyStore = await KeyTokenService.createKeyTokenV2({
          shopId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "keyStore error",
          };
        }

        // create access and refresh token
        const tokens = await createTokenPairV2(
          {
            shopId: newShop._id,
            email,
          },
          publicKey,
          privateKey
        );
        console.log("Successfully created the tokens::", tokens);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["email", "name", "_id"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AuthService;
