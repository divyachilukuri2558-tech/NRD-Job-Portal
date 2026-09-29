const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');
const { authorizeRole } = require('../middleware/role.middleware.js');

// User profile routes (Seeker, Recruiter, Admin)
router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, userController.updateProfile);

// Admin-only user management routes
router.get('/', verifyToken, authorizeRole('admin'), userController.getAllUsers);
router.delete('/:id', verifyToken, authorizeRole('admin'), userController.deleteUser);

module.exports = router;
