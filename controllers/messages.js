const Message = require('../models/Message');

// Send a Private Message
exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      body: req.body.body,
      senderId: req.user.id,  // Sender's ID from the JWT
      recipientId: req.body.recipientId,
      postId: req.body.postId,  // The post related to the message
    });
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);  // Log error
    res.status(500).json({
      message: 'Error sending message',
      error: error.message || error,
    });
  }
};

// Fetch Messages for the Logged-In User
exports.getMessagesForUser = async (req, res) => {
  try {
    const messages = await Message.findAll({ where: { recipientId: req.user.id } });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);  // Log error
    res.status(500).json({
      message: 'Error fetching messages',
      error: error.message || error,
    });
  }
};
