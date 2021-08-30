'use strict';

const { Router } = require(`express`);
const { HttpCode } = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  route.get(`/`, (_req, res) => {
    const articles = articleService.findAll();

    return res.status(HttpCode.OK).json(articles);
  });

  route.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const { article } = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, [articleExist(articleService), articleValidator], (req, res) => {
    const { article } = res.locals;

    const updatedarticle = articleService.update(article.id, req.body);

    return res.status(HttpCode.OK).json(updatedarticle);
  });

  route.delete(`/:articleId`, articleExist(articleService), (_req, res) => {
    const { article } = res.locals;

    const articleId = articleService.remove(article.id);

    return res.status(HttpCode.OK).json(articleId);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (_req, res) => {
    const { article } = res.locals;

    const comments = commentService.findAll(article);

    return res.status(HttpCode.OK).json(comments);

  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const { article } = res.locals;
    const { commentId } = req.params;

    const removedCommentId = commentService.remove(article, commentId);

    if (!removedCommentId) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment not found`);
    }

    return res.status(HttpCode.OK).json(removedCommentId);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const { article } = res.locals;

    const comment = commentService.create(article, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  app.use(`/articles`, route);
};
