"use strict";

const {
  createResource,
  createRole,
  listRole,
  listResource,
} = require("../services/rbac.service");
const { SuccessResponse } = require("../utils/apiSuccess");

/**
 * @desc Create a new role
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 * @param {*} res
 * @param {*} next
 */
const newRole = async (req, res, next) => {
  new SuccessResponse({
    message: "Created role successfully!",
    metadata: await createRole(req.body),
  }).send(res);
};

const newResource = async (req, res, next) => {
  new SuccessResponse({
    message: "Created resource successfully!",
    metadata: await createResource(req.body),
  }).send(res);
};

const roleList = async (req, res, next) => {
  new SuccessResponse({
    message: "Get list role successfully!",
    metadata: await listRole(req.query),
  }).send(res);
};

const resourceList = async (req, res, next) => {
  new SuccessResponse({
    message: "Get list resource successfully!",
    metadata: await listResource(req.query),
  }).send(res);
};

module.exports = {
  newRole,
  newResource,
  resourceList,
  roleList,
};
