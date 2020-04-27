'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const {themes, previews, news, lastComments, categories} = require(`../mocks`);


mainRouter.get(`/`, (req, res) => res.render(`main`, {themes, previews, news, comments: lastComments}));
mainRouter.get(`/signup`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, (req, res) => res.render(`search`));
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`, {categories}));

module.exports = mainRouter;
