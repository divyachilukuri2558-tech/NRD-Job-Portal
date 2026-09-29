const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.config.js');

// Verifies the JWT sent in the Authorization header (Bearer <token>)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['x-access-token'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: No authentication token provided!'
    });
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired token. Please log in again.'
      });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;
    req.userName = decoded.name;
    next();
  });
};

module.exports = {
  verifyToken
};
