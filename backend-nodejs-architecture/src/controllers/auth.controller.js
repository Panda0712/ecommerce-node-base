"use strict";

const { CREATED, SuccessResponse } = require("../utils/apiSuccess");

const AuthService = require("../services/auth.service");

class AuthController {
  refreshToken = async (req, res, next) => {
    // version 1
    // const { refreshToken } = req.body;
    // new SuccessResponse({
    //   message: "Get token success!",
    //   metadata: await AuthService.handleRefreshToken(refreshToken),
    // }).send(res);

    new SuccessResponse({
      message: "Get token success!",
      metadata: await AuthService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AuthService.login(req.body),
    }).send(res);
  };

  logout = async (req, res, next) => {
    await AuthService.logout({ keyStore: req.keyStore });
    new SuccessResponse({
      message: "Logout successfully!",
    }).send(res);
  };

  signUp = async (req, res, next) => {
    const { email, name, password } = req.body;
    const newUser = await AuthService.signUpV2({ email, name, password });
    new CREATED({
      message: "Registered successfully!",
      metadata: newUser,
    }).send(res);
  };
}

module.exports = new AuthController();
