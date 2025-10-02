const JWT = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../utils/apiError");
const { asyncHandler } = require("../helpers/asyncHandler");
const { HEADER } = require("../utils/constants");
const { findByShopId } = require("../services/keyToken.service");

const authentication = asyncHandler(async (req, res, next) => {
  /*
  1. check user id missing?
  2. get accessToken
  3. verifyToken
  4. check user in db
  5. check keystore with this userid
  6. OK all -> return next  
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request!");

  const keyStore = await findByShopId(userId);
  if (!keyStore) throw new NotFoundError("Not found KeyStore!");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request!");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.shopId)
      throw new AuthFailureError("Invalid ShopId!");
    req.keyStore = keyStore;
    next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request!");

  const keyStore = await findByShopId(userId);
  if (!keyStore) throw new NotFoundError("Not found KeyStore!");

  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.shopId)
        throw new AuthFailureError("Invalid userId!");
      req.keyStore = keyStore;
      req.user = decodeUser;
      console.log(req.user);
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request!");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.shopId)
      throw new AuthFailureError("Invalid ShopId!");
    req.keyStore = keyStore;
    req.user = decodeUser;
    next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  authentication,
  authenticationV2,
};
