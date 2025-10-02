"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../middlewares/authMiddleware");
const {
  newRole,
  roleList,
  newResource,
  resourceList,
} = require("../../controllers/rbac.controller");

const router = express.Router();

router.post("/role", asyncHandler(newRole));
router.get("/roles", asyncHandler(roleList));

router.post("/resource", asyncHandler(newResource));
router.get("/resources", asyncHandler(resourceList));

module.exports = router;
