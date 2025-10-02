const permission = (permission) => {
  // return a closure function to use
  // properties of parent function (permission)
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permissions denied!",
      });
    }

    console.log("Permission::", req.objKey.permission);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permissions denied!",
      });
    }

    next();
  };
};

module.exports = permission;
