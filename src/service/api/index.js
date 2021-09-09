'use strict';

const { Router } = require(`express`);
const chalk = require(`chalk`);

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

const getMockData = require(`../lib/get-mock-data`);

const getApiRoutes = async () => {
  const appRouter = new Router();

  try {
    const mockData = await getMockData();

    category(appRouter, new CategoryService(mockData));
    article(appRouter, new ArticleService(mockData));
    comments(appRouter, new ArticleService(mockData), new CommentService());
    search(appRouter, new SearchService(mockData));

    return appRouter;
  } catch (error) {
    console.error(chalk.red(`Ошибка при создании роутера`, error));
    return undefined;
  }
};

module.exports = getApiRoutes;
