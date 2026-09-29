const { Job, Recruiter } = require('../models');

// Get all jobs with filtering and searching
const getAllJobs = async (req, res) => {
  try {
    const { search, title, skills, location, employment_type, experience, status } = req.query;

    const filteredJobs = await Job.findAll({
      search,
      title,
      skills,
      location,
      employment_type,
      experience,
      status: status || 'Active'
    });

    return res.status(200).json({
      success: true,
      count: filteredJobs.length,
      jobs: filteredJobs
    });
  } catch (error) {
    console.error('getAllJobs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve jobs.', error: error.message });
  }
};

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    return res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('getJobById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve job details.', error: error.message });
  }
};

// Create a new job (Recruiter only)
const createJob = async (req, res) => {
  try {
    const {
      title,
      company_name,
      description,
      requirements,
      skills,
      location,
      employment_type,
      salary,
      experience_required,
      posted_date,
      last_date,
      status
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and location are required.'
      });
    }

    // Find recruiter profile ID for the current logged in user
    const recruiter = await Recruiter.findByUserId(req.userId);
    if (!recruiter) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter profile not found. Please complete your recruiter profile first.'
      });
    }

    const finalCompany = company_name || recruiter.company_name;

    const newJob = await Job.create({
      recruiter_id: recruiter.id,
      title,
      company_name: finalCompany,
      description,
      requirements: requirements || '',
      skills: skills || '',
      location,
      employment_type: employment_type || 'Full Time',
      salary: salary || 'Competitive',
      experience_required: experience_required || 'Not Specified',
      posted_date,
      last_date,
      status: status || 'Active'
    });

    return res.status(201).json({
      success: true,
      message: 'Job posting created successfully!',
      jobId: newJob.id
    });
  } catch (error) {
    console.error('createJob error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create job posting.', error: error.message });
  }
};

// Update an existing job (Recruiter who created it or Admin)
const updateJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const {
      title,
      company_name,
      description,
      requirements,
      skills,
      location,
      employment_type,
      salary,
      experience_required,
      last_date,
      status
    } = req.body;

    // Check ownership if recruiter
    if (req.userRole === 'recruiter') {
      const recruiter = await Recruiter.findByUserId(req.userId);
      if (!recruiter) {
        return res.status(403).json({ success: false, message: 'Recruiter profile not found.' });
      }
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }
      if (job.recruiter_id !== recruiter.id) {
        return res.status(403).json({ success: false, message: 'Unauthorized: You can only edit jobs you posted.' });
      }
    }

    await Job.update(jobId, {
      title,
      company_name,
      description,
      requirements,
      skills,
      location,
      employment_type,
      salary,
      experience_required,
      last_date,
      status
    });

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully!'
    });
  } catch (error) {
    console.error('updateJob error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update job.', error: error.message });
  }
};

// Delete a job (Recruiter who created it or Admin)
const deleteJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);

    // Verify ownership if recruiter
    if (req.userRole === 'recruiter') {
      const recruiter = await Recruiter.findByUserId(req.userId);
      if (!recruiter) {
        return res.status(403).json({ success: false, message: 'Recruiter profile not found.' });
      }
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
      }
      if (job.recruiter_id !== recruiter.id) {
        return res.status(403).json({ success: false, message: 'Unauthorized: You can only delete jobs you posted.' });
      }
    }

    const deleted = await Job.delete(jobId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully.'
    });
  } catch (error) {
    console.error('deleteJob error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete job.', error: error.message });
  }
};

// Get jobs posted by the logged-in recruiter
const getRecruiterJobs = async (req, res) => {
  try {
    const recruiter = await Recruiter.findByUserId(req.userId);
    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Recruiter profile not found.' });
    }

    const jobs = await Job.findByRecruiterId(recruiter.id);
    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('getRecruiterJobs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve your job postings.', error: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs
};
