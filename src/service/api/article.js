'use strict';

const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);

module.exports = (appRouter, articleService) => {
  const router = new Router();

  router.get(`/`, async (req, res) => {
    const { offset, limit, comments } = req.query;
    const needComments = comments === `true`;
    const needPagination = Boolean(offset || limit);

    const articles = needPagination
      ? await articleService.findPage({ offset: Number(offset), limit: Number(limit) })
      : await articleService.findAll({ needComments });

    return res.status(HttpCode.OK).json(articles);
  });

  router.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  router.get(`/:articleId`, articleExist(articleService), (_req, res) => {
    const { article } = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  router.put(`/:articleId`, [articleExist(articleService), articleValidator], async (req, res) => {
    const { article } = res.locals;

    const updatedarticle = await articleService.update(article.id, req.body);

    return res.status(HttpCode.OK).json(updatedarticle);
  });

  router.delete(`/:articleId`, articleExist(articleService), async (_req, res) => {
    const { article } = res.locals;

    const result = await articleService.remove(article.id);

    return res.status(HttpCode.OK).json({ result });
  });

  appRouter.use(`/articles`, router);
};
