const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('recommend', 'complain'),
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dislikes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Post.belongsTo(User, { as: 'author', foreignKey: 'userId' });

module.exports = Post;
