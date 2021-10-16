'use strict';

const { DataTypes, Model } = require(`sequelize`);

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

module.exports = define;
