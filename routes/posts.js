const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');  // Correct import
const router = express.Router();

// Create Post (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      userId: req.user.id,  // Use the ID from the decoded JWT token
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

module.exports = router;
