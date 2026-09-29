const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const userController = require('../controllers/user.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');
const { authorizeRole } = require('../middleware/role.middleware.js');

// All admin routes require verifyToken and authorizeRole('admin')
router.use(verifyToken, authorizeRole('admin'));

router.get('/statistics', adminController.getStatistics);
router.get('/users', userController.getAllUsers);
router.get('/jobs', adminController.getAllJobsAdmin);
router.get('/applications', adminController.getAllApplicationsAdmin);

module.exports = router;
