const { User, JobSeeker, Recruiter } = require('../models');

// Get profile of authenticated user
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    let roleProfile = null;
    if (user.role === 'seeker') {
      roleProfile = await JobSeeker.findByUserId(user.id);
    } else if (user.role === 'recruiter') {
      roleProfile = await Recruiter.findByUserId(user.id);
    }

    return res.status(200).json({
      success: true,
      user,
      profile: roleProfile
    });
  } catch (error) {
    console.error('getProfile error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving profile.', error: error.message });
  }
};

// Update profile of authenticated user
const updateProfile = async (req, res) => {
  try {
    const { name, phone, skills, education, experience, resume_headline, bio, company_name, company_description, company_location, website } = req.body;

    // Update users table name & phone
    if (name) {
      await User.update(req.userId, { name, phone });
    }

    if (req.userRole === 'seeker') {
      await JobSeeker.upsertByUserId(req.userId, {
        skills,
        education,
        experience,
        resume_headline,
        bio
      });
    } else if (req.userRole === 'recruiter') {
      await Recruiter.upsertByUserId(req.userId, {
        company_name,
        company_description,
        company_location,
        website
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!'
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
};

// Admin: Get all users
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await User.findAll(role);
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('getAllUsers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users.', error: error.message });
  }
};

// Admin: Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (userId === req.userId) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account.' });
    }

    const deleted = await User.delete(userId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    console.error('deleteUser error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete user.', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser
};
