'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const {notes, myComments} = require(`../mocks`);


myRouter.get(`/`, (req, res) => res.render(`my/my`, {notes}));
myRouter.get(`/comments`, (req, res) => res.render(`my/comments`, {comments: myComments}));

module.exports = myRouter;
