// Import libraries
const express = require('express');  // Framework עבור Node.js לבניית אפליקציות web
const cors = require('cors');  // Middleware לאפשר בקשות cross-origin
const sequelize = require('./config/db');  // ORM להתחברות וניהול בסיס הנתונים
const authRoutes = require('./routes/auth');  // נתיבים לאימות משתמשים
const postRoutes = require('./routes/posts');  // נתיבים לניהול פוסטים
const commentsRoutes = require('./routes/comments');  // נתיבים לניהול תגובות
const bodyParser = require('body-parser');  // Middleware לפירוש גוף הבקשה
const jwt = require('jsonwebtoken');  // ספריה ליצירת וניהול JSON Web Tokens
const authenticateToken = require('./middleware/authMiddleware');  // Middleware לאימות טוקנים

// Load environment variables
require('dotenv').config();  // טעינת משתני סביבה מקובץ .env

// Import all models
const User = require('./models/User');  // מודל משתמש
const Post = require('./models/Post');  // מודל פוסט
const Comment = require('./models/Comment');  // מודל תגובה

// Initialize express app
const app = express();  // יצירת אפליקציית Express

// Middleware setup
app.use(bodyParser.json());  // פירוש גוף הבקשה כ-JSON
app.use(cors());  // אפשור CORS

// Token generation for guests
const createGuestToken = () => {
  return jwt.sign(
    { role: 'guest' },  // תוכן הטוקן
    process.env.JWT_SECRET,  // מפתח סודי לחתימה
    { expiresIn: '1h' }  // זמן תפוגה של הטוקן
  );
};

// Route for getting guest token
app.get('/api/auth/guest-token', (req, res) => {
  const token = createGuestToken();  // יצירת טוקן אורח
  res.json({ token });  // שליחת הטוקן כתשובה
});

// Posts route
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.findAll();  // שליפת כל הפוסטים מבסיס הנתונים
    res.json(posts);  // שליחת הפוסטים כתשובה
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts.' });  // טיפול בשגיאות
  }
});

// Use routes for authentication
app.use('/api/auth', authRoutes);
console.log("Auth routes loaded at /api/auth");  // לוג לאחר טעינת הנתיב של האימות

// Use routes for posts with authentication
app.use('/api/posts', authenticateToken, postRoutes);  // הוספת אימות לנתיבי הפוסטים
console.log("Post routes loaded at /api/posts");  // לוג לאחר טעינת הנתיב של הפוסטים

// Use comments routes with authentication
app.use('/api/comments', authenticateToken, commentsRoutes);  // שימוש בנתיבי התגובות
console.log("Comment routes loaded at /api/comments");  // לוג לאחר טעינת הנתיב של התגובות

// Sync models with the database
sequelize.sync({ force: false })  // סנכרון המודלים עם בסיס הנתונים (ללא מחיקת טבלאות קיימות)
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT || 5000, () => {  // הפעלת השרת
      console.log('Server running on port 5000');
    });
  })
  .catch(err => console.error('Error syncing database:', err));  // טיפול בשגיאות סנכרון
