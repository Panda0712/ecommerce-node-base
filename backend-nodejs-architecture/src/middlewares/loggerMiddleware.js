"use strict";

const Logger = require("../loggers/discord.log.v2");

const pushToDiscordLog = async (req, res, next) => {
  try {
    Logger.sendFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `${req.get("host")}${req.originalUrl}`,
    });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pushToDiscordLog,
};
