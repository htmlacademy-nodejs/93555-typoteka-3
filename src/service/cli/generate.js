'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const { nanoid } = require(`nanoid`);

const { getRandomInt, shuffle } = require(`../../utils`);
const { ExitCode, MAX_ID_LENGTH } = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;

const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const Time = {
  MS: 1000,
  SECONDS: 60,
  MINUTES: 60,
  HOURS: 24,
  DAYS_LIMIT: 90
};

const DateLimits = {
  min: Date.now() - Time.SECONDS * Time.MINUTES * Time.HOURS * Time.DAYS_LIMIT * Time.MS,
  max: Date.now()
};


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
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const generateArticles = async (count) => {
  const [sentences, titles, categories, comments] = await Promise.all([
    readContent(FILE_SENTENCES_PATH),
    readContent(FILE_TITLES_PATH),
    readContent(FILE_CATEGORIES_PATH),
    readContent(FILE_COMMENTS_PATH)
  ]);

  return Array(count).fill({}).map(() => {
    const announceCount = getRandomInt(1, 5);
    const fullTextCount = getRandomInt(1, 10);
    const categoryCount = getRandomInt(1, 3);

    return {
      id: nanoid(MAX_ID_LENGTH),
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences).slice(0, announceCount).join(` `),
      fullText: shuffle(sentences).slice(0, fullTextCount).join(` `),
      categories: shuffle(categories).slice(0, categoryCount),
      comments: generateComments(getRandomInt(0, comments.length - 1), comments),
      createdDate: new Date(getRandomInt(DateLimits.min, DateLimits.max))
    };
  });
};


module.exports = {
  name: `--generate`,
  async run(args) {
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
      const content = JSON.stringify(await generateArticles(countArticles));
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Операция выполнена успешно. Файл создан.`));
      process.exit(ExitCode.success);
    } catch (err) {
      console.error(chalk.red(`Невозможно записать данные в файл.`));
      process.exit(ExitCode.error);
    }
  }
};
