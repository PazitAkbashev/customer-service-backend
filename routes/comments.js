// routes/comments.js

const express = require('express');
const Comment = require('../models/Comment'); // ייבוא המודל של התגובות
const authMiddleware = require('../middleware/authMiddleware'); // ייבוא המידלו של האימות
const router = express.Router();

// יצירת תגובה חדשה (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { body, postId } = req.body; // קבלת גוף התגובה וה-ID של הפוסט מהבקשה

    // בדוק אם הגוף נמסר
    if (!body || !postId) {
      return res.status(400).json({ message: 'Body and postId are required.' });
    }

    const comment = await Comment.create({
      body,
      userId: req.user.id, // ה-ID של המשתמש שיצר את התגובה (אם יש אימות)
      postId // הוספת ה-ID של הפוסט
    });

    res.status(201).json(comment); // החזרת התגובה שנוצרה
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error }); // טיפול בשגיאות
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
      message: 'Error fetching comments',
      error: error.message || error,
    });
  }
});

// ייצוא ה-router כך שניתן יהיה להשתמש בו בקובץ הראשי (server.js)
module.exports = router;
