require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'nrd_lab_job_portal_jwt_secret_key_2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
