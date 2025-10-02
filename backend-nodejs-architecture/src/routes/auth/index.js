"use strict";

const express = require("express");
const authController = require("../../controllers/auth.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/shop/signup", asyncHandler(authController.signUp));
router.post("/shop/login", asyncHandler(authController.login));

// authentication middleware
router.use(authenticationV2);

// logout
router.post("/shop/logout", asyncHandler(authController.logout));
// refresh token
router.post("/shop/refresh-token", asyncHandler(authController.refreshToken));

module.exports = router;
