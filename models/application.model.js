const db = require('../db/db.js');

// Application Model encapsulating MySQL operations for the `applications` table
const Application = {
  // Submit a new application
  create: async ({ job_id, seeker_id, cover_note = '', status = 'Applied' }) => {
    const result = await db.query(
      'INSERT INTO applications (job_id, seeker_id, cover_note, status) VALUES (?, ?, ?, ?)',
      [job_id, seeker_id, cover_note, status]
    );
    return {
      id: result.insertId,
      job_id,
      seeker_id,
      cover_note,
      status,
      applied_date: new Date().toISOString()
    };
  },

  // Check if candidate already applied for this job (duplicate check)
  checkDuplicate: async (job_id, seeker_id) => {
    const rows = await db.query(
      'SELECT id FROM applications WHERE job_id = ? AND seeker_id = ?',
      [job_id, seeker_id]
    );
    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Find all applications submitted by a specific seeker
  findBySeekerId: async (seekerId) => {
    const sql = `
      SELECT a.id, a.job_id, a.applied_date, a.status, a.cover_note,
             j.title as job_title, j.company_name, j.location, j.employment_type, j.salary, j.status as job_status
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.seeker_id = ?
      ORDER BY a.applied_date DESC
    `;
    return await db.query(sql, [seekerId]);
  },

  // Find all applications for a specific job (with applicant details)
  findByJobId: async (jobId) => {
    const sql = `
      SELECT a.id, a.job_id, a.applied_date, a.status, a.cover_note,
             j.title as job_title,
             u.id as user_id, u.name as applicant_name, u.email as applicant_email, u.phone as applicant_phone,
             js.skills, js.education, js.experience, js.resume_headline, js.bio
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN job_seekers js ON a.seeker_id = js.id
      JOIN users u ON js.user_id = u.id
      WHERE a.job_id = ?
      ORDER BY a.applied_date DESC
    `;
    return await db.query(sql, [jobId]);
  },

  // Find all applications across all jobs for a specific recruiter
  findByRecruiterId: async (recruiterId) => {
    const sql = `
      SELECT a.id, a.job_id, a.applied_date, a.status, a.cover_note,
             j.title as job_title, j.company_name, j.location,
             u.id as user_id, u.name as applicant_name, u.email as applicant_email, u.phone as applicant_phone,
             js.skills, js.education, js.experience, js.resume_headline, js.bio
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN job_seekers js ON a.seeker_id = js.id
      JOIN users u ON js.user_id = u.id
      WHERE j.recruiter_id = ?
      ORDER BY a.applied_date DESC
    `;
    return await db.query(sql, [recruiterId]);
  },

  // Find single application by ID
  findById: async (id) => {
    const sql = `
      SELECT a.id, a.job_id, a.seeker_id, a.applied_date, a.status, a.cover_note,
             j.title as job_title,
             u.id as user_id, u.name as applicant_name, u.email as applicant_email, u.phone as applicant_phone,
             js.skills, js.education, js.experience
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN job_seekers js ON a.seeker_id = js.id
      JOIN users u ON js.user_id = u.id
      WHERE a.id = ?
    `;
    const rows = await db.query(sql, [id]);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Update application status
  updateStatus: async (id, status) => {
    const result = await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  // Delete / withdraw application by ID
  delete: async (id) => {
    const result = await db.query('DELETE FROM applications WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Count total applications or count by status
  count: async (status = null) => {
    let sql = 'SELECT COUNT(*) as count FROM applications';
    let params = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    const rows = await db.query(sql, params);
    return rows && rows.length > 0 ? rows[0].count : 0;
  },

  // Find all applications platform-wide (Admin)
  findAll: async () => {
    const sql = `
      SELECT a.id, a.job_id, a.applied_date, a.status, a.cover_note,
             j.title as job_title, j.company_name,
             u.id as user_id, u.name as applicant_name, u.email as applicant_email, u.phone as applicant_phone,
             js.skills, js.education, js.experience
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN job_seekers js ON a.seeker_id = js.id
      JOIN users u ON js.user_id = u.id
      ORDER BY a.applied_date DESC
    `;
    return await db.query(sql);
  }
};

module.exports = Application;
