const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Post = require('./Post');

const Message = sequelize.define('Message', {
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });
Message.belongsTo(Post, { foreignKey: 'postId' });

module.exports = Message;
