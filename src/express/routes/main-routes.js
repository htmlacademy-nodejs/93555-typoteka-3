"use strict";

const { Router } = require(`express`);
const mainRouter = new Router();
const { themes } = require(`../mocks`);
const { api } = require(`../api/api`);
const { transformArticle } = require(`../api/adapter`);
const { HttpCode } = require("../../constants");

mainRouter.get(`/`, async (_req, res) => {
  const articles = await api.getArticles();

  return res.render(`main`, {
    themes,
    articles: articles.map(transformArticle),
    comments: articles.flatMap((article) => article.comments).slice(0, 10),
  });
});

mainRouter.get(`/categories`, async (_req, res) => {
  const categories = await api.getCategories();

  return res.render(`all-categories`, { categories });
});

mainRouter.get(`/search`, async (req, res) => {
  const { query } = req.query;
  let articles = [];

  if (!query) {
    return res.render(`search`, { articles, query });
  }

  try {
    articles = await api.searchArticles(query);
  } catch (err) {
    if (err.response.status !== HttpCode.NOT_FOUND) {
      console.log(err);
    }
  }

  return res.render(`search`, {
    articles: articles.map(transformArticle),
    query,
  });
});

mainRouter.get(`/signup`, (_req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (_req, res) => res.render(`login`));

module.exports = mainRouter;
