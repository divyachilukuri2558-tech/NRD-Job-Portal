const { Application, JobSeeker, Job, Recruiter } = require('../models');

// Apply for a job (Seeker only)
const applyJob = async (req, res) => {
  try {
    const { jobId, cover_note } = req.body;

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job ID is required.' });
    }

    // Find seeker profile for current user
    const seeker = await JobSeeker.findByUserId(req.userId);
    if (!seeker) {
      return res.status(400).json({
        success: false,
        message: 'Job seeker profile not found. Please complete your seeker profile first.'
      });
    }

    // Verify job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job does not exist.' });
    }

    if (job.status === 'Closed') {
      return res.status(400).json({ success: false, message: 'This job posting has been closed.' });
    }

    // Check duplicate application
    const existing = await Application.checkDuplicate(jobId, seeker.id);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job! Duplicate applications are not allowed.'
      });
    }

    // Insert application using Application model
    const newApp = await Application.create({
      job_id: jobId,
      seeker_id: seeker.id,
      cover_note: cover_note || '',
      status: 'Applied'
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: newApp.id
    });
  } catch (error) {
    console.error('applyJob error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit application.', error: error.message });
  }
};

// Get current seeker's applications
const getMyApplications = async (req, res) => {
  try {
    const seeker = await JobSeeker.findByUserId(req.userId);
    if (!seeker) {
      return res.status(200).json({ success: true, count: 0, applications: [] });
    }

    const applications = await Application.findBySeekerId(seeker.id);
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('getMyApplications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve applications.', error: error.message });
  }
};

// Get applications for a specific job (Recruiter or Admin)
const getJobApplications = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    const applications = await Application.findByJobId(jobId);
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('getJobApplications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve applicants.', error: error.message });
  }
};

// Get all applications for the current recruiter across all jobs
const getRecruiterApplications = async (req, res) => {
  try {
    const recruiter = await Recruiter.findByUserId(req.userId);
    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Recruiter profile not found.' });
    }

    const applications = await Application.findByRecruiterId(recruiter.id);
    return res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('getRecruiterApplications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve applications.', error: error.message });
  }
};

// Update application status (Recruiter or Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = Number(req.params.id);
    const { status } = req.body;

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await Application.updateStatus(applicationId, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Application status updated to '${status}'.`
    });
  } catch (error) {
    console.error('updateApplicationStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update application status.', error: error.message });
  }
};

// Withdraw application (Seeker only)
const withdrawApplication = async (req, res) => {
  try {
    const applicationId = Number(req.params.id);

    const seeker = await JobSeeker.findByUserId(req.userId);
    if (!seeker) {
      return res.status(403).json({ success: false, message: 'Seeker profile not found.' });
    }

    const app = await Application.findById(applicationId);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (app.seeker_id !== seeker.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You can only withdraw your own applications.' });
    }

    await Application.delete(applicationId);

    return res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully.'
    });
  } catch (error) {
    console.error('withdrawApplication error:', error);
    return res.status(500).json({ success: false, message: 'Failed to withdraw application.', error: error.message });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  withdrawApplication
};
