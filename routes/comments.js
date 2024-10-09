// routes/comments.js

const express = require('express');
const Comment = require('../models/Comment'); // ייבוא המודל של התגובות
const authMiddleware = require('../middleware/authMiddleware'); // ייבוא המידלו של האימות
const router = express.Router();

// יצירת תגובה חדשה (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { body, postId } = req.body; // קבלת הנתונים מהגוף של הבקשה
    const comment = await Comment.create({
      body,
      userId: req.user.id, // שימוש ב-ID מהטוקן המפוענח
      postId, // הוספת ה-ID של הפוסט שהתייחס אליו
    });
    res.status(201).json(comment); // החזרת התגובה שנוצרה
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error }); // טיפול בשגיאות
  }
});

// שליפת כל התגובות לפוסט מסוים
router.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId; // קבלת ה-ID של הפוסט מהפרמטרים של הבקשה
    try {
        const comments = await Comment.findAll({ where: { postId } }); // שליפת כל התגובות עם postId שווה ל-ID המבוקש
        res.json(comments); // החזרת התגובות שנמצאו
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error }); // טיפול בשגיאות
    }
});




// ייצוא ה-router כך שניתן יהיה להשתמש בו בקובץ הראשי (server.js)
module.exports = router;
