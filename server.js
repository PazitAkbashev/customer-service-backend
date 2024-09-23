const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

// Import all models
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Message = require('./models/Message');

require('dotenv').config();

const app = express();
app.use(express.json()); // This allows Express to parse JSON request bodies
app.use(cors());

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Sync models with the database
sequelize.sync({ force: false })  // Set force: false to avoid dropping tables
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => console.error('Error syncing database:', err));