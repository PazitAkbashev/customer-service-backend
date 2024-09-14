const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');  // Import the authentication routes
require('dotenv').config();

const app = express();

// Add the express.json() middleware here
app.use(express.json());  // This allows Express to parse JSON request bodies
app.use(cors());

// Use the auth routes
app.use('/api/auth', authRoutes);  // This registers the /api/auth routes

// Test MySQL connection and sync database
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port 5000');
  });
});
