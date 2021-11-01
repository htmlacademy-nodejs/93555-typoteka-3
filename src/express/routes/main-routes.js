"use strict";

const { Router } = require(`express`);
const mainRouter = new Router();
const { api } = require(`../api/api`);
const { transformArticle } = require(`../api/adapter`);
const { HttpCode, PAGINATION } = require(`../../constants`);


mainRouter.get(`/`, async (req, res) => {
  const { page = 1 } = req.query;
  const parsedPage = Number(page);
  const offset = (parsedPage - PAGINATION.ARTICLES_SKIP_PAGE_COUNT) * PAGINATION.ARTICLES_PER_PAGE;

  const [{ count, articles }, categories] = await Promise.all([
    api.getArticles({
      limit: PAGINATION.ARTICLES_PER_PAGE,
      offset,
      comments: true
    }),
    api.getCategories()
  ]);

  const totalPages = Math.ceil(count / PAGINATION.ARTICLES_PER_PAGE);

  return res.render(`main`, {
    categories,
    articles: articles.map(transformArticle),
    comments: articles.flatMap((article) => article.comments).slice(0, 10),
    page: parsedPage,
    totalPages
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
