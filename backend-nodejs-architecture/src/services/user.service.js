"use strict";

const { AuthFailureError, BadRequestError } = require("../utils/apiError");
const { sendEmailToken } = require("./email.service");
const User = require("../models/user.model");
const { checkEmailToken } = require("./otp.service");
const KeyTokenService = require("./keyToken.service");
const bcrypt = require("bcrypt");
const { createUser } = require("../models/repositories/user.repo");
const { createTokenPairV2 } = require("../utils/auth");
const { getInfoData } = require("../utils/helpers");

const newUser = async ({ email = null, captcha = null }) => {
  // 1. check email existence in db
  const user = await User.findOne({ email }).lean();

  // 2. if user is exists
  if (user) return AuthFailureError("User is already exists!");

  // 3. send token via user email
  const result = await sendEmailToken({ email });

  // 4. return the result
  return {
    message: "Created user successfully!",
    statusCode: 201,
    metadata: { token: result },
  };
};

const checkLoginEmailToken = async ({ token }) => {
  try {
    // 1. check token in mode otp
    const { otp_email: email, otp_token } = await checkEmailToken({ token });
    if (!email) throw new BadRequestError("Token not found!!!");

    // 2. check email exists in user model
    const hasUser = await findUserByEmailWithLogin({ email });
    if (hasUser) throw new BadRequestError("Email already exists!");

    // 3. create new user
    // hash the password
    const hashedPassword = await bcrypt.hash(email, 10);

    // create shop
    const newUser = await createUser({
      usr_id: 1,
      usr_slug: "sdfsdf",
      usr_name: email,
      usr_password: hashedPassword,
      usr_role: "",
    });

    // generate access token and refresh token
    if (newUser) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyTokenV2({
        userId: newUser.usr_id,
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
          shopId: newUser.usr_id,
          email,
        },
        publicKey,
        privateKey
      );
      console.log("Successfully created the tokens::", tokens);

      return {
        code: 201,
        message: "verify successfully!",
        metadata: {
          user: getInfoData({
            fields: ["usr_email", "usr_name", "usr_id"],
            object: newUser,
          }),
          tokens,
        },
      };
    }
  } catch (error) {
    console.error(error);
  }
};

const findUserByEmailWithLogin = async ({ email }) => {
  const user = await User.findOne({ usr_email: email }).lean();
  return user;
};

module.exports = {
  newUser,
  checkLoginEmailToken,
  findUserByEmailWithLogin,
};
