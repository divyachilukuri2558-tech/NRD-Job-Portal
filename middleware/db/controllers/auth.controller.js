const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, JobSeeker, Recruiter } = require('../models');
const authConfig = require('../config/auth.config.js');

// Register a new user (job seeker or recruiter)
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, company_name, company_description, company_location, website } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required fields.'
      });
    }

    if (!['seeker', 'recruiter'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "seeker" or "recruiter".'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if email already registered
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered. Please login or use a different email.'
      });
    }

    // Hash password using bcryptjs
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user using User model
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || null
    });

    const userId = newUser.id;

    // Insert corresponding role profile using JobSeeker / Recruiter models
    let profileData = {};
    if (role === 'seeker') {
      const seeker = await JobSeeker.create({ user_id: userId });
      profileData = { seekerId: seeker.id };
    } else if (role === 'recruiter') {
      const recruiter = await Recruiter.create({
        user_id: userId,
        company_name: company_name || `${name}'s Organization`,
        company_description: company_description || '',
        company_location: company_location || '',
        website: website || ''
      });
      profileData = { recruiterId: recruiter.id, company_name: recruiter.company_name };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role, name },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn }
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: {
        id: userId,
        name,
        email,
        role,
        phone: phone || '',
        ...profileData
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Query user by email using User model
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Verify password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Fetch role specific details using models
    let profileData = {};
    if (user.role === 'seeker') {
      const seeker = await JobSeeker.findByUserId(user.id);
      if (seeker) {
        profileData = { seekerId: seeker.id, ...seeker };
        delete profileData.user_id;
      }
    } else if (user.role === 'recruiter') {
      const recruiter = await Recruiter.findByUserId(user.id);
      if (recruiter) {
        profileData = { recruiterId: recruiter.id, ...recruiter };
        delete profileData.user_id;
      }
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      authConfig.secret,
      { expiresIn: authConfig.expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        ...profileData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message
    });
  }
};

// Get current logged-in user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    let profileData = {};
    if (user.role === 'seeker') {
      const seeker = await JobSeeker.findByUserId(user.id);
      if (seeker) {
        profileData = { seekerId: seeker.id, ...seeker };
      }
    } else if (user.role === 'recruiter') {
      const recruiter = await Recruiter.findByUserId(user.id);
      if (recruiter) {
        profileData = { recruiterId: recruiter.id, ...recruiter };
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        ...profileData
      }
    });
  } catch (error) {
    console.error('GetCurrentUser error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user information.',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
