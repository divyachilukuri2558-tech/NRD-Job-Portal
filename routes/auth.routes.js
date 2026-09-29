const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');

// Public auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected auth route
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router;
