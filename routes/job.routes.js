const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');
const { authorizeRole } = require('../middleware/role.middleware.js');

// Public job routes
router.get('/', jobController.getAllJobs);

// Recruiter jobs route (must precede /:id)
router.get('/recruiter/my', verifyToken, authorizeRole('recruiter'), jobController.getRecruiterJobs);

// Public single job route
router.get('/:id', jobController.getJobById);

// Recruiter create job route
router.post('/', verifyToken, authorizeRole('recruiter'), jobController.createJob);

// Recruiter or Admin edit job route
router.put('/:id', verifyToken, authorizeRole('recruiter', 'admin'), jobController.updateJob);

// Recruiter or Admin delete job route
router.delete('/:id', verifyToken, authorizeRole('recruiter', 'admin'), jobController.deleteJob);

module.exports = router;
