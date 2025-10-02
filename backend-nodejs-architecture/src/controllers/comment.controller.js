"use strict";

const CommentService = require("../services/comment.service");
const { SuccessResponse } = require("../utils/apiSuccess");

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Created comment successfully!!",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };

  getComments = async (req, res, next) => {
    new SuccessResponse({
      message: "Get comments successfully!!",
      metadata: await CommentService.getCommentsByParentId(req.query),
    }).send(res);
  };

  deleteComments = async (req, res, next) => {
    new SuccessResponse({
      message: "Deleted comments successfully!!",
      metadata: await CommentService.deleteComments(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
