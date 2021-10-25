'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const { getRandomInt, shuffle } = require(`../../utils`);
const { ExitCode } = require(`../../constants`);
const { apiLogger } = require(`../lib/logger`);

const DEFAULT_COUNT = 10;
const MAX_COUNT = 1000;

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_USERS_PATH = `./data/users.txt`;


const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`).filter(Boolean);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = async ({ count, sentences, titles, categories, comments, users }) => {
  return Array(count).fill({}).map(() => {
    const announceCount = getRandomInt(1, 5);
    const fullTextCount = getRandomInt(1, 10);
    const categoryCount = getRandomInt(1, 3);
    const userId = getRandomInt(1, users.length);

    return {
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences).slice(0, announceCount).map((item) => item.slice(0, 50)).join(` `),
      fullText: shuffle(sentences).slice(0, fullTextCount).join(` `),
      categories: shuffle(categories).slice(0, categoryCount),
      comments: generateComments(getRandomInt(0, comments.length - 1), comments).map((item) => ({ userId, text: item.text })),
      userId
    };
  });
};


module.exports = {
  name: `--fillDb`,
  async run(args) {
    try {
      apiLogger.info(`Trying to connect to database...`);
      await sequelize.authenticate();

    } catch (err) {
      apiLogger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    apiLogger.info(`Connection to database established`);

    const [sentences, titles, categories, comments, users] = await Promise.all([
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_COMMENTS_PATH),
      readContent(FILE_USERS_PATH)
    ]);

    const [count] = args;

    if (count !== undefined && isNaN(count)) {
      console.log(chalk.red(`В качестве параметра необходимо ввести число.`));
      process.exit(ExitCode.error);
    }

    const countArticles = Number(count) || DEFAULT_COUNT;

    if (countArticles > MAX_COUNT) {
      console.log(chalk.red(`Не больше 1000 публикаций.`));
      process.exit(ExitCode.error);
    }

    try {
      const articles = await generateArticles({ count: countArticles, sentences, titles, categories, comments, users });
      initDatabase(sequelize, { articles, categories, users: users.map((item) => item.split(` `)) });
    } catch (err) {
      console.error(chalk.red(`Невозможно записать данные в файл.`));
      process.exit(ExitCode.error);
    }
  }
};
