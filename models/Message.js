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

// Define relationships
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });  // Message sender (company)
Message.belongsTo(User, { as: 'recipient', foreignKey: 'recipientId' });  // Message recipient (user)
Message.belongsTo(Post, { foreignKey: 'postId' });  // The post related to the message

module.exports = Message;
