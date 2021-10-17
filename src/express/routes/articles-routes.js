"use strict";

const { Router } = require(`express`);

const articlesRouter = new Router();
const { previews } = require(`../mocks`);
const { api } = require(`../api/api`);
const { transformArticle, parseCreatedArticle } = require(`../api/adapter`);
const { upload } = require(`../lib/upload`);

const renderPost = async (req, res, next) => {
  try {
    const [article, categories] = await Promise.all([api.getArticle(req.params.id), api.getCategories()]);

    return res.render(`articles/post`, {
      article: transformArticle(article),
      categories,
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

articlesRouter.get(`/category/:id`, async (req, res) => {
  const [articles, categories] = await Promise.all([api.getArticles({ comments: true }), api.getCategories()]);

  res.render(`articles/articles-by-category`, { articles, categories, previews });
});

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
    return renderAddPost(req, res);
  }
});

articlesRouter.get(`/edit/:id`, renderPost);
articlesRouter.get(`/:id`, renderPost);

module.exports = articlesRouter;
