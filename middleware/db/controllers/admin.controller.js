const { User, Job, Application } = require('../models');

// Get overall platform analytics & statistics for Admin Dashboard & Chart.js
const getStatistics = async (req, res) => {
  try {
    // Counts using models
    const totalUsers = await User.count();
    const totalSeekers = await User.count('seeker');
    const totalRecruiters = await User.count('recruiter');
    const totalJobs = await Job.count();
    const activeJobs = await Job.count('Active');
    const totalApplications = await Application.count();

    // Applications by status
    const statuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];
    const applicationsByStatus = {};
    for (const st of statuses) {
      applicationsByStatus[st] = await Application.count(st);
    }

    // Jobs by employment type
    const employmentTypes = ['Full Time', 'Part Time', 'Internship', 'Contract'];
    const jobsByEmploymentType = {};
    for (const et of employmentTypes) {
      jobsByEmploymentType[et] = await Job.countByEmploymentType(et);
    }

    // Users by role
    const usersByRole = {
      seeker: totalSeekers,
      recruiter: totalRecruiters,
      admin: totalUsers - totalSeekers - totalRecruiters
    };

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalSeekers,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        applicationsByStatus,
        jobsByEmploymentType,
        usersByRole
      }
    });
  } catch (error) {
    console.error('getStatistics error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve statistics.', error: error.message });
  }
};

// Admin: Get all jobs with full details
const getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.findAll({ status: null });
    return res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error('getAllJobsAdmin error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve jobs.', error: error.message });
  }
};

// Admin: Get all applications platform-wide
const getAllApplicationsAdmin = async (req, res) => {
  try {
    const applications = await Application.findAll();
    return res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    console.error('getAllApplicationsAdmin error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve applications.', error: error.message });
  }
};

module.exports = {
  getStatistics,
  getAllJobsAdmin,
  getAllApplicationsAdmin
};
