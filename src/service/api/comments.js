'use strict';

const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (appRouter, articleService, commentService) => {
  const router = new Router();

  router.get(`/:articleId/comments`, articleExist(articleService), async (_req, res) => {
    const { article } = res.locals;

    const comments = await commentService.findAll(article.id);

    return res.status(HttpCode.OK).json(comments);

  });

  router.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const { article } = res.locals;

    const comment = await commentService.create(article.id, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  router.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const { commentId } = req.params;

    const result = await commentService.remove(commentId);

    if (!result) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment not found`);
    }

    return res.status(HttpCode.OK).json({ result });
  });

  appRouter.use(`/articles`, router);
};
