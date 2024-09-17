const jwt = require('jsonwebtoken');

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization');

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Split to remove 'Bearer'
    req.user = decoded;  // Attach the decoded user data to the request
    next();  // Proceed to the next middleware
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
