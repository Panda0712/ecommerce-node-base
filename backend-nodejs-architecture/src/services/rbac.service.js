"use strict";

const Resource = require("../models/resource.model");
const Role = require("../models/role.model");

/**
 * new resource
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 */
const createResource = async ({
  name = "profile",
  slug = "p0001",
  description = "",
}) => {
  try {
    // 1. check name or slug existence
    // 2. new resource
    const resource = await Resource.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  } catch (error) {
    return error;
  }
};

const listResource = async ({
  userId = 0,
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // 1. che3ck admin in middleware function
    // 2. get list of resources
    const resources = await Resource.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createdAt: 1,
        },
      },
    ]);

    return resources;
  } catch (error) {
    return [];
  }
};

const createRole = async ({
  name = "shop",
  slug = "s0001",
  description = "extended from shop or user",
  grants = [],
}) => {
  try {
    // 1. check role existence
    // 2. add role
    const role = await Role.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });

    return role;
  } catch (error) {
    return error;
  }
};

const listRole = async ({
  userId = 0,
  limit = 30,
  offset = 0,
  search = "",
}) => {
  try {
    // 1. userid
    // 2. get list roles
    const roles = await Role.aggregate([
      {
        $unwind: "$rol_grants",
      },
      {
        $lookup: {
          from: "Resources",
          localField: "rol_grants.resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $project: {
          role: "$rol_name",
          resource: "$resource.src_name",
          action: "$rol_grants.actions",
          attributes: "$rol_grants.attributes",
        },
      },
      {
        $unwind: "$action",
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: "$action",
          attribute: 1,
        },
      },
    ]);

    console.log(roles);
    return roles;
  } catch (error) {
    return [];
  }
};

module.exports = {
  createResource,
  listResource,
  createRole,
  listRole,
};
