const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');

const Comment = sequelize.define('Comment', {
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Define relationships
Comment.belongsTo(User, { foreignKey: 'userId' });  // A comment belongs to a user
Comment.belongsTo(Post, { foreignKey: 'postId' });  // A comment belongs to a post

module.exports = Comment;
