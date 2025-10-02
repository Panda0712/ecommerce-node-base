const { findById } = require("../services/apikey.service");
const { HEADER } = require("../utils/constants");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden error!",
      });
    }

    // check obj key in the database
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden error!",
      });
    }

    req.objKey = objKey;
    next();
  } catch (error) {
    return error;
  }
};

module.exports = apiKey;
