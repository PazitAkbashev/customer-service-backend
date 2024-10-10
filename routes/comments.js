// routes/comments.js

const express = require('express');
const Comment = require('../models/Comment'); // ייבוא המודל של התגובות
const authMiddleware = require('../middleware/authMiddleware'); // ייבוא המידלו של האימות
const router = express.Router();

// יצירת פוסט חדש (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body; // קבלת הכותרת והגוף מהבקשה

    // בדוק אם הכותרת והגוף נמסרו
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required.' });
    }

    const post = await Post.create({
      title,
      body,
      userId: req.user.id // ה-ID של המשתמש שיצר את הפוסט (אם יש אימות)
    });

    res.status(201).json(post); // החזרת הפוסט שנוצר
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error }); // טיפול בשגיאות
  }
});

// שליפת כל התגובות לפוסט מסוים
router.get('/posts/:postId', async (req, res) => {
  const postId = req.params.postId; // קבלת ה-ID של הפוסט
  try {
      const comments = await Comment.findAll({ where: { postId } }); // שליפת התגובות מהבסיס נתונים
      res.json(comments); // שליחת התגובות
  } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error });
  }
});

// נתיב להחזרת כל התגובות
router.get('/', async (req, res) => {
  try {
    // שליפת כל התגובות מבסיס הנתונים
    const comments = await Comment.findAll();
    
    // החזרת התגובות כ-JSON
    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching posts',
      error: error.message || error,
    });
  }
});

// ייצוא ה-router כך שניתן יהיה להשתמש בו בקובץ הראשי (server.js)
module.exports = router;

