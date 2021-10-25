'use strict';

const { Model } = require(`sequelize`);

class ArticleCategories extends Model { }

const define = (sequelize) => ArticleCategories.init({}, {
  sequelize, modelName: `ArticleCategories`,
  tableName: `article_categories`
});

module.exports = define;
