// Import libraries
const express = require('express');  // Framework עבור Node.js לבניית אפליקציות web
const cors = require('cors');  // Middleware לאפשר בקשות cross-origin
const sequelize = require('./config/db');  // ORM להתחברות וניהול בסיס הנתונים
const authController = require('./controller/auth');  // נתיבים לאימות משתמשים
const postController = require('./controller/posts');  // נתיבים לניהול פוסטים
const commentsController = require('./controller/comments');  // נתיבים לניהול תגובות
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



// Use Controller for authentication
app.use('/api/auth', authController);
console.log("Auth Controller loaded at /api/auth");  // לוג לאחר טעינת הנתיב של האימות

// Use  for posts with authentication
app.use('/api/posts', authenticateToken, postController);  // הוספת אימות לנתיבי הפוסטים
console.log("Post Controller loaded at /api/posts");  // לוג לאחר טעינת הנתיב של הפוסטים

// Use comments Controller with authentication
app.use('/api/comments', authenticateToken, commentsController);  // שימוש בנתיבי התגובות
console.log("Comment Controller loaded at /api/comments");  // לוג לאחר טעינת הנתיב של התגובות

// Sync models with the database
sequelize.sync({ force: false })  // סנכרון המודלים עם בסיס הנתונים (ללא מחיקת טבלאות קיימות)
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT || 5000, () => {  // הפעלת השרת
      console.log('Server running on port 5000');
    });
  })
  .catch(err => console.error('Error syncing database:', err));  // טיפול בשגיאות סנכרון