'use strict';

const { DataTypes, Model } = require(`sequelize`);
const Aliase = require(`./aliase`);

class Category extends Model { }

const define = (sequelize) => Category.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Category`,
  tableName: `categories`
});

const defineRelations = ({ Article, ArticleCategories }) => {
  Category.belongsToMany(Article, { through: ArticleCategories, as: Aliase.ARTICLES });
  Category.hasMany(ArticleCategories, { as: Aliase.ARTICLE_CATEGORIES });
};


module.exports = { define, defineRelations };
