const db = require('../db/db.js');

// JobSeeker Model encapsulating MySQL operations for the `job_seekers` table
const JobSeeker = {
  // Create a new job seeker profile
  create: async ({ user_id, skills = '', education = '', experience = '', resume_headline = '', bio = '' }) => {
    const result = await db.query(
      'INSERT INTO job_seekers (user_id, skills, education, experience, resume_headline, bio) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, skills, education, experience, resume_headline, bio]
    );
    return {
      id: result.insertId,
      user_id,
      skills,
      education,
      experience,
      resume_headline,
      bio
    };
  },

  // Find job seeker profile by user_id
  findByUserId: async (userId) => {
    const rows = await db.query('SELECT * FROM job_seekers WHERE user_id = ?', [userId]);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Find job seeker profile by primary key id
  findById: async (id) => {
    const rows = await db.query('SELECT * FROM job_seekers WHERE id = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Update or insert job seeker profile by user_id
  upsertByUserId: async (userId, { skills = '', education = '', experience = '', resume_headline = '', bio = '' }) => {
    const existing = await JobSeeker.findByUserId(userId);
    if (existing) {
      await db.query(
        'UPDATE job_seekers SET skills = ?, education = ?, experience = ?, resume_headline = ?, bio = ? WHERE user_id = ?',
        [skills, education, experience, resume_headline, bio, userId]
      );
      return { id: existing.id, user_id: userId, skills, education, experience, resume_headline, bio };
    } else {
      return await JobSeeker.create({ user_id: userId, skills, education, experience, resume_headline, bio });
    }
  },

  // Delete seeker profile by user_id
  deleteByUserId: async (userId) => {
    const result = await db.query('DELETE FROM job_seekers WHERE user_id = ?', [userId]);
    return result.affectedRows > 0;
  }
};

module.exports = JobSeeker;
