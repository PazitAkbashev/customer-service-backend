const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./middleware/authMiddleware');
require('dotenv').config();

// Import all models
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Message = require('./models/Message');

const app = express();

app.use(express.json());
app.use(cors());

// יצירת טוקן לאורחים
const createGuestToken = () => {
  return jwt.sign(
    { role: 'guest' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// נתיב לקבלת טוקן אורח
app.get('/api/auth/guest-token', (req, res) => {
  const token = createGuestToken(); // השתמש בפונקציה שיצרת
  res.json({ token });
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.findAll(); // שליפת כל הפוסטים ממסד הנתונים
    res.json(posts); // מחזיר את הפוסטים בפורמט JSON
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts.' }); // טיפול בשגיאות
  }
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', authenticateToken, postRoutes); // הוספת אימות לכל הבקשות לפוסטים

// Sync models with the database
sequelize.sync({ force: false })  
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => console.error('Error syncing database:', err));