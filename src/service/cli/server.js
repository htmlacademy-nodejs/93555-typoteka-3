"use strict";

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const {HttpCode, ExitCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const DATA_FILENAME = `mocks.json`;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>Node: Typoteka</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

const getMessage = async () => {
  const fileContent = await fs.readFile(DATA_FILENAME);
  const mocks = JSON.parse(fileContent);
  const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
  return `<ul>${message}</ul>`;
};

const onClientConnect = async (req, res) => {
  const notFoundMessage = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const message = await getMessage();
        sendResponse(res, HttpCode.OK, message);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessage);
      }
      break;

    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessage);
      break;
  }
};


module.exports = {
  name: `--server`,
  run(args) {

    const [customPort] = args;

    if (customPort !== undefined && isNaN(customPort)) {
      console.log(chalk.red(`В качестве порта необходимо ввести число.`));
      process.exit(ExitCode.error);
    }

    const port = Number(customPort) || DEFAULT_PORT;

    http.createServer(onClientConnect)
    .listen(port)
    .on(`listening`, (err) => {
      if (err) {
        return console.error(`Ошибка при создании сервера`, err);
      }
      return console.info(chalk.green(`Ожидаю соединение на http://localhost:${port}`));
    });
  }
};
