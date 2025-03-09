const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Check if JWT_SECRET is properly configured
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret === 'your_jwt_secret_key_here') {
    console.error('JWT_SECRET is not properly configured');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 