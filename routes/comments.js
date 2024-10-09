// routes/comments.js

const express = require('express');
const Comment = require('../models/Comment'); // ייבוא המודל של התגובות
const authMiddleware = require('../middleware/authMiddleware'); // ייבוא המידלו של האימות
const router = express.Router();

// יצירת תגובה חדשה (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const body = " nn ";
    const postId = 1;
    const comment = await Comment.create({
      body,
      postId, // Add the ID of the post being commented on
    });
    res.status(201).json(comment); // Return the created comment
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error }); // Error handling
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

// שליפת כל התגובות
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findAll(); // שליפת כל התגובות מהבסיס נתונים
    res.json(comments); // שליחת התגובות
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error }); // טיפול בשגיאות
  }
});

// ייצוא ה-router כך שניתן יהיה להשתמש בו בקובץ הראשי (server.js)
module.exports = router;

