'use strict';

const { Router } = require(`express`);
const chalk = require(`chalk`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const category = require(`./category`);
const article = require(`./article`);
const comments = require(`./comments`);
const search = require(`./search`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);


const getApiRoutes = async () => {
  const appRouter = new Router();

  try {
    defineModels(sequelize);

    category(appRouter, new CategoryService(sequelize));
    article(appRouter, new ArticleService(sequelize));
    comments(appRouter, new ArticleService(sequelize), new CommentService(sequelize));
    search(appRouter, new SearchService(sequelize));

    return appRouter;
  } catch (error) {
    console.error(chalk.red(`Ошибка при создании роутера`, error));
    return undefined;
  }
};

module.exports = getApiRoutes;
