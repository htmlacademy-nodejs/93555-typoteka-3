'use strict';

const CategoryModel = require(`./category`);
const CommentModel = require(`./comment`);
const ArticleModel = require(`./article`);
const UserModel = require(`./user`);
const ArticleCategoriesModel = require(`./article-categories`);

const define = (sequelize) => {
  const Category = CategoryModel.define(sequelize);
  const Comment = CommentModel.define(sequelize);
  const Article = ArticleModel.define(sequelize);
  const User = UserModel.define(sequelize);
  const ArticleCategories = ArticleCategoriesModel.define(sequelize);

  [CategoryModel, CommentModel, ArticleModel, UserModel].forEach((model) => {
    model.defineRelations({ Comment, Category, Article, ArticleCategories, User });
  });

  return { Category, Comment, User, Article, ArticleCategories };
};

module.exports = define;
