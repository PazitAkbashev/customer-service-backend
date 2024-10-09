// models/Comment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // ייבוא מודול ה-Sequelize
const Post = require('./Post');
// הגדרת מודל Comment
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true, // הוספת timestamps (createdAt, updatedAt)
});

Comment.belongsTo(Post, {  foreignKey: 'postId' });

// ייצוא המודל
module.exports = Comment;
