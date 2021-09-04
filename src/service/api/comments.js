'use strict';

const { Router } = require(`express`);

const { HttpCode } = require(`../../constants`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (appRouter, articleService, commentService) => {
  const router = new Router();

  router.get(`/:articleId/comments`, articleExist(articleService), (_req, res) => {
    const { article } = res.locals;

    const comments = commentService.findAll(article);

    return res.status(HttpCode.OK).json(comments);

  });

  router.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const { article } = res.locals;

    const comment = commentService.create(article, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  router.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const { article } = res.locals;
    const { commentId } = req.params;

    const removedCommentId = commentService.remove(article, commentId);

    if (!removedCommentId) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment not found`);
    }

    return res.status(HttpCode.OK).json({ id: removedCommentId });
  });

  appRouter.use(`/articles`, router);
};
