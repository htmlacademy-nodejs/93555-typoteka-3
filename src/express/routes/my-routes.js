"use strict";

const { Router } = require(`express`);
const myRouter = new Router();
const { api } = require(`../api/api`);
const { transformArticle, transformComments } = require(`../api/adapter`);

myRouter.get(`/`, async (_req, res) => {
  const articles = await api.getArticles({ comments: true });

  return res.render(`my/my`, { articles: articles.map(transformArticle) });
});

myRouter.get(`/comments`, async (_req, res) => {
  const articles = await api.getArticles({ comments: true });
  const comments = articles.map(transformComments).flat();

  return res.render(`my/comments`, { comments });
});

module.exports = myRouter;
