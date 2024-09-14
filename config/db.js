const { Sequelize } = require('sequelize');
require('dotenv').config();

// Set up the Sequelize instance to connect to the MySQL database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);


// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


module.exports = sequelize;
