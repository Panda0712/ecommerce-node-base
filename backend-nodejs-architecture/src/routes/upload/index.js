"use strict";

"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../middlewares/authMiddleware");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");

const router = express.Router();

// middleware
// router.use(authenticationV2);

// create inventory
router.post("/product", asyncHandler(uploadController.uploadFile));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadThumb)
);
router.post(
  "/product/thumb/multiple",
  uploadDisk.array("files", 3),
  asyncHandler(uploadController.uploadMultipleThumbs)
);
router.post(
  "/product/thumb/s3",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadFileS3)
);

module.exports = router;
