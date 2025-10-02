"use strict";

const User = require("../user.model");

const createUser = async ({
  usr_id,
  usr_name,
  usr_slug,
  usr_password,
  usr_role,
}) => {
  const user = await User.create({
    usr_id,
    usr_name,
    usr_slug,
    usr_password,
    usr_role,
  });

  return user;
};

module.exports = {
  createUser,
};
