//controllers/comments.js

const Comment = require('../models/Comment');

// Function to add a comment
const addComment = async (req, res) => {
  try {
    const { body, userId, postId } = req.body;
    const newComment = await Comment.create({ body, userId, postId });
    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating comment', error });
  }
};

module.exports = { addComment };
