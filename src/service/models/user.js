'use strict';

const { DataTypes, Model } = require(`sequelize`);
const Aliase = require(`./aliase`);

class User extends Model { }

const define = (sequelize) => User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  sequelize,
  modelName: `User`,
  tableName: `users`
});

const defineRelations = ({ Article, Comment }) => {
  User.hasMany(Comment, { as: Aliase.COMMENTS, foreignKey: `userId` });
  User.hasMany(Article, { as: Aliase.ARTICLES, foreignKey: `userId` });
};

module.exports = { define, defineRelations };
