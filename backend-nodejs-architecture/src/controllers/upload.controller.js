"use strict";

const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadMultipleImagesFromLocal,
  uploadImageFromLocalS3,
} = require("../services/upload.service");
const { BadRequestError } = require("../utils/apiError");
const { SuccessResponse } = require("../utils/apiSuccess");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "Uploaded image successfully!!!",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadThumb = async (req, res, next) => {
    if (!req.file)
      throw new BadRequestError("Please upload a valid image file!!!");

    new SuccessResponse({
      message: "Uploaded image successfully!!!",
      metadata: await uploadImageFromLocal(req.file),
    }).send(res);
  };

  uploadMultipleThumbs = async (req, res, next) => {
    if (!req.files?.length) throw new BadRequestError("Please upload files!!!");

    new SuccessResponse({
      message: "Uploaded images successfully!!!",
      metadata: await uploadMultipleImagesFromLocal({
        files: req.files,
      }),
    }).send(res);
  };

  uploadFileS3 = async (req, res, next) => {
    if (!req.file) throw new BadRequestError("Please upload file!!!");

    new SuccessResponse({
      message: "Uploaded image successfully!!!",
      metadata: await uploadImageFromLocalS3({
        file: req.file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
