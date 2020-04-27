'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const {themes, previews, postComments} = require(`../mocks`);


articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`, {themes, previews}));
articlesRouter.get(`/add`, (req, res) => res.render(`articles/new-post`));
articlesRouter.get(`/:id`, (req, res) => res.render(`articles/post`, {themes: themes.slice(0, 3), comments: postComments}));

module.exports = articlesRouter;
