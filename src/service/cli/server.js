"use strict";

const chalk = require(`chalk`);
const express = require(`express`);
const fs = require(`fs`).promises;
const {HttpCode, ExitCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const DATA_FILENAME = `mocks.json`;

const app = express();
app.use(express.json());

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(DATA_FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    console.log(chalk.red(err));
    res.json([]);
  }
});

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));


module.exports = {
  name: `--server`,
  run(args) {

    const [customPort] = args;

    if (customPort !== undefined && isNaN(customPort)) {
      console.log(chalk.red(`В качестве порта необходимо ввести число.`));
      process.exit(ExitCode.error);
    }

    const port = Number(customPort) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return console.error(`Ошибка при создании сервера`, err);
      }
      return console.info(chalk.green(`Ожидаю соединение на http://localhost:${port}`));
    });
  }
};
