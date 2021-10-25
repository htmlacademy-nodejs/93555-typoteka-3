'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для api.

    Гайд: node ./src/service/service.js <command>

    Команды:
      --version:            выводит номер версии
      --help:               печатает этот текст
      --fillDb <count>      наполняет базу данных
    `;

    console.log(chalk.gray(text));
  }
};
