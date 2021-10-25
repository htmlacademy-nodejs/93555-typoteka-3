'use strict';

const { DataTypes, Model } = require(`sequelize`);
const Aliase = require(`./aliase`);

class Article extends Model { }

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  announce: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullText: {
    type: DataTypes[`STRING`](1000),
  },
  picture: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

const defineRelations = ({ User, Comment, Category, ArticleCategories }) => {
  Article.hasMany(Comment, { as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade` });
  Article.belongsToMany(Category, { through: ArticleCategories, as: Aliase.CATEGORIES });
  Article.belongsTo(User, { foreignKey: `userId` });
};


module.exports = { define, defineRelations };
