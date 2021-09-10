"use strict";

const { apiLogger } = require(`../lib/logger`);

module.exports.logErrors = (err, _req, res, _next) => {
  apiLogger.error(`An error occurred on processing request: ${err.message}`);

  res.status(500).json({ httpStatus: 500, message: `Internal server error` });
};
