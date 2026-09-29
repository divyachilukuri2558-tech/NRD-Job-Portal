const db = require('../db/db.js');

// Recruiter Model encapsulating MySQL operations for the `recruiters` table
const Recruiter = {
  // Create a new recruiter profile
  create: async ({ user_id, company_name, company_description = '', company_location = '', website = '' }) => {
    const result = await db.query(
      'INSERT INTO recruiters (user_id, company_name, company_description, company_location, website) VALUES (?, ?, ?, ?, ?)',
      [user_id, company_name, company_description, company_location, website]
    );
    return {
      id: result.insertId,
      user_id,
      company_name,
      company_description,
      company_location,
      website
    };
  },

  // Find recruiter profile by user_id
  findByUserId: async (userId) => {
    const rows = await db.query('SELECT * FROM recruiters WHERE user_id = ?', [userId]);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Find recruiter profile by primary key id
  findById: async (id) => {
    const rows = await db.query('SELECT * FROM recruiters WHERE id = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Update or insert recruiter profile by user_id
  upsertByUserId: async (userId, { company_name, company_description = '', company_location = '', website = '' }) => {
    const existing = await Recruiter.findByUserId(userId);
    if (existing) {
      await db.query(
        'UPDATE recruiters SET company_name = ?, company_description = ?, company_location = ?, website = ? WHERE user_id = ?',
        [company_name || existing.company_name, company_description, company_location, website, userId]
      );
      return { id: existing.id, user_id: userId, company_name: company_name || existing.company_name, company_description, company_location, website };
    } else {
      return await Recruiter.create({ user_id: userId, company_name, company_description, company_location, website });
    }
  },

  // Delete recruiter profile by user_id
  deleteByUserId: async (userId) => {
    const result = await db.query('DELETE FROM recruiters WHERE user_id = ?', [userId]);
    return result.affectedRows > 0;
  }
};

module.exports = Recruiter;
