'use strict';

const { DataTypes, Model } = require(`sequelize`);

class Comment extends Model { }

const define = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`
});

const defineRelations = ({ Article, User }) => {
  Comment.belongsTo(Article, { foreignKey: `articleId` });
  Comment.belongsTo(User, { foreignKey: `userId` });
};

module.exports = { define, defineRelations };
