"use strict";

const { listRole } = require("../services/rbac.service");
const { AuthFailureError } = require("../utils/apiError");
const rbac = require("./role.middleware");

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(
        await listRole({
          userId: 9999,
        })
      );
      const rol_name = req.query.role;
      const permission = rbac.can(rol_name)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("you don't have enough permission!!!");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
