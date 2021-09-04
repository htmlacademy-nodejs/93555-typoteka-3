"use strict";

const express = require(`express`);
const chalk = require(`chalk`);

const { ExitCode, API_PREFIX } = require(`../../constants`);
const getApiRoutes = require(`../api`);
const { apiLogger } = require(`../lib/logger`);
const { logRequests, logNotFound } = require('../middlewares/logHttp')
const { logErrors } = require('../middlewares/logErrors')

const DEFAULT_PORT = 3000;


module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;

    if (customPort !== undefined && isNaN(customPort)) {
      apiLogger.error(chalk.red(`You must enter a number as the port`));
      process.exit(ExitCode.error);
    }

    const routes = await getApiRoutes();

    if (!routes) {
      process.exit(ExitCode.error);
    }

    const port = Number(customPort) || DEFAULT_PORT;

    const app = express();

    app.use(express.json());
    app.use(logRequests);
    app.use(API_PREFIX, routes);
    app.use(logNotFound);
    app.use(logErrors);

    app.listen(port, (err) => {
      if (err) {
        return apiLogger.error(`Server creation error`);
      }
      return apiLogger.info(`Server is running on http://localhost:${port}`)

    });
  },
};
