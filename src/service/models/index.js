'use strict';

const { Model } = require(`sequelize`);


const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineUser = require(`./user`);

const Aliase = require(`./aliase`);


const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const User = defineUser(sequelize);


  class ArticleCategory extends Model { }
  ArticleCategory.init({}, {
    sequelize, modelName: `ArticleCategory`,
    tableName: `article_categories`
  });

  Article.hasMany(Comment, { as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade` });
  Comment.belongsTo(Article, { foreignKey: `articleId` });

  Article.belongsToMany(Category, { through: ArticleCategory, as: Aliase.CATEGORIES });
  Category.belongsToMany(Article, { through: ArticleCategory, as: Aliase.ARTICLES });
  Category.hasMany(ArticleCategory, { as: Aliase.ARTICLE_CATEGORIES });

  User.hasMany(Comment, { as: Aliase.COMMENTS, foreignKey: `userId` });
  Comment.belongsTo(User, { foreignKey: `userId` });

  User.hasMany(Article, { as: Aliase.ARTICLES, foreignKey: `userId` });
  Article.belongsTo(User, { foreignKey: `userId` });

  return { Category, Comment, User, Article, ArticleCategory };
};

module.exports = define;
