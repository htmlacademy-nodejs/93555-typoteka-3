"use strict";

const { Router } = require(`express`);

const articlesRouter = new Router();
const { themes, previews } = require(`../mocks`);
const { api } = require(`../api/api`);
const { transformArticle, parseCreatedArticle } = require(`../api/adapter`);
const { upload } = require(`../lib/upload`);

const renderPost = async (req, res, next) => {
  try {
    const article = await api.getArticle(req.params.id);

    return res.render(`articles/post`, {
      article: transformArticle(article),
      themes,
      comments: article.comments,
    });
  } catch (err) {
    console.log(err.message);
    return next();
  }
};

const renderAddPost = async (req, res) => {
  const categories = await api.getCategories();
  const post = req.body || {};

  return res.render(`articles/new-post`, {
    categories,
    post,
    isChecked: (category) => (post.categories || []).includes(category),
  });
};

articlesRouter.get(`/category/:id`, (_req, res) =>
  res.render(`articles/articles-by-category`, { themes, previews })
);

articlesRouter.get(`/add`, renderAddPost);

articlesRouter.post(`/add`, upload.single(`picture`), async (req, res) => {
  try {
    const article = parseCreatedArticle(req);

    if (!article) {
      return renderAddPost(req, res);
    }

    await api.createArticle(article);

    return res.redirect(`/my`);
  } catch (err) {
    console.log(err);
    renderAddPost(req, res);
  }
});

articlesRouter.get(`/edit/:id`, renderPost);
articlesRouter.get(`/:id`, renderPost);

module.exports = articlesRouter;
