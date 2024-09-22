const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
exports.register = async (req, res) => {
  //the data to receive from the user
  const { username, email, password } = req.body;

  try {
    // Check if user already exists by email- defined as unique
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password for sacure the real password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database in User table
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Return the created user with ok response (without the password)
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Error registering user:', error);  // Log error
    res.status(500).json({
      message: 'Error registering user',
      error: error.message || error,  // Send back detailed error message
    });
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials, check email' }); //return bad request
    }

    // Compare the password (the hashed one with the original, by 'bcrypt')
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token (to authorize protected routes)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);  // Log error
    res.status(500).json({
      message: 'Error logging in',
      error: error.message || error,  // Send back detailed error message
    });
  }
};
