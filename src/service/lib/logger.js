'use strict';

const pino = require(`pino`);
const { ENV } = require(`../../constants`);

const LOG_FILE_PATH = `./logs/api.log`;

const isDevelopment = process.env.NODE_ENV === ENV.DEVELOPMENT;
const level = process.env.LOG_LEVEL;
const defaultLogLevel = isDevelopment ? `info` : `error`;
const destination = isDevelopment ? process.stdout : LOG_FILE_PATH;

const logger = pino({
  name: `base-logger`,
  level: level || defaultLogLevel,
  prettyPrint: isDevelopment,
}, destination);



const getLogger = (options = {}) => logger.child(options);

module.exports = {
  apiLogger: getLogger({ name: `api` }),
};
