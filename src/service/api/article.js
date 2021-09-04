'use strict';

const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);

module.exports = (appRouter, articleService) => {
  const router = new Router();

  router.get(`/`, (_req, res) => {
    const articles = articleService.findAll();

    return res.status(HttpCode.OK).json(articles);
  });

  router.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const { article } = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  router.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  router.put(`/:articleId`, [articleExist(articleService), articleValidator], (req, res) => {
    const { article } = res.locals;

    const updatedarticle = articleService.update(article.id, req.body);

    return res.status(HttpCode.OK).json(updatedarticle);
  });

  router.delete(`/:articleId`, articleExist(articleService), (_req, res) => {
    const { article } = res.locals;

    const articleId = articleService.remove(article.id);

    return res.status(HttpCode.OK).json({ id: articleId });
  });

  appRouter.use(`/articles`, router);
};
