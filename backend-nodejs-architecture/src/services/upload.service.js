"use strict";

const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand,
} = require("../configs/aws.s3.config");
const cloudinary = require("../configs/cloudinary.config");
const crypto = require("crypto");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer"); // ESM

// UPLOAD FILE USING S3 BUCKET
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const randomImageName = () => crypto.randomBytes(16).toString("hex");
    const imageName = file.originalname + `-${randomImageName()}` || "unknown";

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await s3.send(command);
    console.log(result);

    // export url
    const singledUrl = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
    });

    // url by s3 request presigner
    // const url = await getSignedUrl(s3, singledUrl, { expiresIn: 3600 });

    // url by cloudfront by on private and public key
    const signedUrl = getSignedUrl({
      url: `${process.env.CLOUDFRONT_DOMAIN}/${imageName}`,
      keyPairId: process.env.CLOUDFRONT_PUBLIC_KEY_ID,
      dateLessThan: new Date(Date.now() + 1000 * 60), // 60s
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
    });

    return {
      url: `${process.env.CLOUDFRONT_DOMAIN}/${imageName}`,
      secure_url: signedUrl,
      result,
    };
  } catch (error) {
    console.error("Error while uploading images to s3 bucket!!!", error);
  }
};

// CLOUDINARY SERVICE
// 1. upload from url image
const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    const folderName = "product/shopId";
    const newFileName = "testDemo";

    const result = await cloudinary.uploader.upload(urlImage, {
      public_id: newFileName,
      folder: folderName,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error while uploading images!!!", error);
  }
};

// 2. upload from local image
const uploadImageFromLocal = async ({ path, folderName = "product/8409" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: "thumb",
      folder: folderName,
    });
    console.log(result);
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: "jpg",
      }),
    };
  } catch (error) {
    console.error("Error while uploading images!!!", error);
  }
};

// 3. upload multiple images from local
const uploadMultipleImagesFromLocal = async ({
  files,
  folderName = "product/8409",
}) => {
  try {
    if (!files?.length) return;

    const uploadedResults = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });

      uploadedResults.push({
        image_url: result.secure_url,
        shopId: 8409,
        thumb_url: cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      });
    }

    return uploadedResults;
  } catch (error) {
    console.error("Error while uploading images!!!", error);
  }
};

module.exports = {
  uploadImageFromLocalS3,
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadMultipleImagesFromLocal,
};
