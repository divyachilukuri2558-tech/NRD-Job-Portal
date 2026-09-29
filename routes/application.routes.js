const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller.js');
const { verifyToken } = require('../middleware/auth.middleware.js');
const { authorizeRole } = require('../middleware/role.middleware.js');

// Seeker submit application
router.post('/', verifyToken, authorizeRole('seeker'), applicationController.applyJob);

// Seeker view own applications
router.get('/my', verifyToken, authorizeRole('seeker'), applicationController.getMyApplications);

// Recruiter view all applications for their jobs
router.get('/recruiter', verifyToken, authorizeRole('recruiter'), applicationController.getRecruiterApplications);

// Recruiter or Admin view applicants for a specific job
router.get('/job/:jobId', verifyToken, authorizeRole('recruiter', 'admin'), applicationController.getJobApplications);

// Recruiter or Admin update application status
router.put('/:id/status', verifyToken, authorizeRole('recruiter', 'admin'), applicationController.updateApplicationStatus);

// Seeker withdraw application
router.delete('/:id', verifyToken, authorizeRole('seeker'), applicationController.withdrawApplication);

module.exports = router;
