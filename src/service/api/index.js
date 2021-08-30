'use strict';

const { Router } = require(`express`);
const category = require(`./category`);
const article = require(`./article`);
const search = require(`./search`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`../data-service`);

const getMockData = require(`../lib/get-mock-data`);

const getApiRoutes = async () => {
  const app = new Router();

  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  article(app, new ArticleService(mockData), new CommentService());
  search(app, new SearchService(mockData));

  return app;
};

module.exports = getApiRoutes;
