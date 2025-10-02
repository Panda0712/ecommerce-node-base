"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const UserController = require("../../controllers/user.controller");

const router = express.Router();

router.post("/new_user", asyncHandler(UserController.newUserController));
router.post(
  "/welcome-back",
  asyncHandler(UserController.checkRegisterEmailToken)
);

module.exports = router;
