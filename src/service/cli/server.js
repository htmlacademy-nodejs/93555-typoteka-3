"use strict";

const chalk = require(`chalk`);
const express = require(`express`);

const { HttpCode, ExitCode, API_PREFIX } = require(`../../constants`);
const getApiRoutes = require(`../api`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;

    if (customPort !== undefined && isNaN(customPort)) {
      console.log(chalk.red(`В качестве порта необходимо ввести число.`));
      process.exit(ExitCode.error);
    }

    const port = Number(customPort) || DEFAULT_PORT;
    const routes = await getApiRoutes();

    const app = express();

    app.use(express.json());
    app.use(API_PREFIX, routes);
    app.use((_req, res) => {
      res.status(HttpCode.NOT_FOUND).send(`Not found`);
    })

    app.listen(port, (err) => {
      if (err) {
        return console.error(`Ошибка при создании сервера`, err);
      }
      return console.info(chalk.green(`Ожидаю соединение на http://localhost:${port}`));
    });
  }
};
