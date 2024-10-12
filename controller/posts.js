// controller/posts.js

const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware'); // ייבוא המידלו של האימות
const router = express.Router();

// יצירת פוסט חדש (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      userId: req.user.id, // השתמש ב-ID מהטוקן המפוענח
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// שליפת כל הפוסטים
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll(); // שליפת כל הפוסטים
    res.json(posts); // החזרת הפוסטים שנמצאו
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching posts',
      error: error.message || error,
    });
  }
});

// Route to get posts by user ID
router.get('/auth/user/:id/posts', authMiddleware, async (req, res) => {
  const userId = req.params.id; // קבלת ה-ID מהנתיב

  try {
    // שליפת הפוסטים של המשתמש לפי ה-ID
    const posts = await Post.findAll({
      where: { userId: userId }
    });

    // החזרת הפוסטים שנמצאו
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Error fetching user posts', error });
  }
});


// Route to like a post
router.post('/:postId/like', authMiddleware, async (req, res) => {
  const postId = req.params.postId;

  try {
    // עדכון ה-Likes של הפוסט
    const post = await Post.findByPk(postId); // מציאת הפוסט לפי ה-ID

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes += 1; // הוספת 1 ל-Likes
    await post.save(); // שמירה של הפוסט המעודכן

    res.json({ likes: post.likes });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Error liking post', error });
  }
});

// Route to dislike a post
router.post('/:postId/dislike', authMiddleware, async (req, res) => {
  const postId = req.params.postId;

  try {
    // עדכון ה-Dislikes של הפוסט
    const post = await Post.findByPk(postId); // מציאת הפוסט לפי ה-ID

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.dislikes += 1; // הוספת 1 ל-Dislikes
    await post.save(); // שמירה של הפוסט המעודכן

    res.json({ dislikes: post.dislikes });
  } catch (error) {
    console.error('Error disliking post:', error);
    res.status(500).json({ message: 'Error disliking post', error });
  }
});

// ייצוא ה-router כך שניתן יהיה להשתמש בו בקובץ הראשי (server.js)
module.exports = router;