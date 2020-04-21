'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`my/my`));
myRouter.get(`/comments`, (req, res) => res.render(`my/comments`));

module.exports = myRouter;
