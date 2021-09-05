const { apiLogger } = require(`../lib/logger`);
const { HttpCode } = require(`../../constants`);

module.exports.logRequests = (req, res, next) => {
  apiLogger.debug(`Request on route ${req.url}`);

  res.on(`finish`, () => {
    apiLogger.info(`Response status code ${res.statusCode}`);
  });

  next();
};

module.exports.logNotFound = (req, res) => {
  apiLogger.error(`Route not found: ${req.url}`);

  res.status(HttpCode.NOT_FOUND).send(`Not found`);
};
