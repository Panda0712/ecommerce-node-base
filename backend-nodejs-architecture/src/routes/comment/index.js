"use strict";

const express = require("express");
const commentController = require("../../controllers/comment.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../middlewares/authMiddleware");

const router = express.Router();

// authentication
router.use(authenticationV2);

router.post("/", asyncHandler(commentController.createComment));
router.delete("/", asyncHandler(commentController.deleteComments));
router.get("/", asyncHandler(commentController.getComments));

module.exports = router;
