"use strict";

const fs = require(`fs`);
const chalk = require(`chalk`);

const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;
const TITLES = [
  `Ёлки. История деревьев`,
  `Как перестать беспокоиться и начать жить`,
  `Как достигнуть успеха не вставая с кресла`,
  `Обзор новейшего смартфона`,
  `Лучше рок-музыканты 20-века`,
  `Как начать программировать`,
  `Учим HTML и CSS`,
  `Что такое золотое сечение`,
  `Как собрать камни бесконечности`,
  `Борьба с прокрастинацией`,
  `Рок — это протест`,
  `Самый лучший музыкальный альбом этого года`
];
const SENTENCES = [
  `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
  `Первая большая ёлка была установлена только в 1938 году.`,
  `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
  `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
  `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
  `Собрать камни бесконечности легко, если вы прирожденный герой.`,
  `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
  `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  `Программировать не настолько сложно, как об этом говорят.`,
  `Простые ежедневные упражнения помогут достичь успеха.`,
  `Это один из лучших рок-музыкантов.`,
  `Он написал больше 30 хитов.`,
  `Из под его пера вышло 8 платиновых альбомов.`,
  `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
  `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
  `Достичь успеха помогут ежедневные повторения.`,
  `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
  `Как начать действовать? Для начала просто соберитесь.`,
  `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.`,
  `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`
];
const CATEGORIES = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

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


const generateOffers = (count) =>
  Array(count)
    .fill({})
    .map(() => ({
      title: TITLES[getRandomInt(0, TITLES.length - 1)],
      announce: shuffle(SENTENCES).slice(0, 5).join(` `),
      fullText: shuffle(SENTENCES).slice(0, 10).join(` `),
      createdDate: new Date(getRandomInt(DateLimits.min, DateLimits.max)),
      category: shuffle(CATEGORIES).slice(0, 3),
    }));

module.exports = {
  name: `--generate`,
  run(args) {
    const [count] = args;

    if (count !== undefined && isNaN(count)) {
      console.log(chalk.red(`В качестве параметра необходимо ввести число.`));
      process.exit(ExitCode.error);
    }

    const countOffer = Number(count) || DEFAULT_COUNT;

    if (countOffer > MAX_COUNT) {
      console.log(chalk.red(`Не больше 1000 публикаций.`));
      process.exit(ExitCode.error);
    }

    const content = JSON.stringify(generateOffers(countOffer));

    fs.writeFile(FILE_NAME, content, (err) => {
      if (err) {
        console.error(chalk.red(`Невозможно записать данные в файл.`));
        process.exit(ExitCode.error);
      }

      console.info(chalk.green(`Операция выполнена успешно. Файл создан.`));
      process.exit(ExitCode.success);
    });
  }
};
