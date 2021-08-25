'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const chalk = require(`chalk`);

const DATA_FILENAME = `mocks.json`;

const app = new Router();

app.get(`/posts`, async (_req, res) => {
  try {
    const fileContent = await fs.readFile(DATA_FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    console.log(chalk.red(err));
    res.json([]);
  }
});

module.exports = app;
