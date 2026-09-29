const db = require('../db/db.js');

// Job Model encapsulating MySQL operations for the `jobs` table
const Job = {
  // Create a new job posting
  create: async ({
    recruiter_id,
    title,
    company_name,
    description,
    requirements = '',
    skills = '',
    location,
    employment_type = 'Full Time',
    salary = '',
    experience_required = '',
    posted_date = null,
    last_date = null,
    status = 'Active'
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const defaultLastDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const result = await db.query(
      `INSERT INTO jobs (
        recruiter_id, title, company_name, description, requirements, skills,
        location, employment_type, salary, experience_required, posted_date, last_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recruiter_id,
        title,
        company_name,
        description,
        requirements,
        skills,
        location,
        employment_type,
        salary,
        experience_required,
        posted_date || today,
        last_date || defaultLastDate,
        status
      ]
    );

    return {
      id: result.insertId,
      recruiter_id,
      title,
      company_name,
      description,
      requirements,
      skills,
      location,
      employment_type,
      salary,
      experience_required,
      posted_date: posted_date || today,
      last_date: last_date || defaultLastDate,
      status
    };
  },

  // Find job by ID with recruiter details and applicants count
  findById: async (id) => {
    const sql = `
      SELECT j.*, r.company_name as recruiter_company_name, r.company_description, r.company_location, r.website as company_website,
      (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applications_count
      FROM jobs j
      LEFT JOIN recruiters r ON j.recruiter_id = r.id
      WHERE j.id = ?
    `;
    const rows = await db.query(sql, [id]);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Find all jobs with dynamic filtering (search keyword, location, employment_type, skills, status)
  findAll: async ({ search, title, skills, location, employment_type, experience, status = 'Active' } = {}) => {
    let sql = `
      SELECT j.*, r.company_name as recruiter_company_name, r.company_location, r.website as company_website,
      (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applications_count
      FROM jobs j
      LEFT JOIN recruiters r ON j.recruiter_id = r.id
      WHERE 1=1
    `;
    let params = [];

    if (status) {
      sql += ' AND j.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (j.title LIKE ? OR j.description LIKE ? OR j.skills LIKE ? OR j.company_name LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    if (title) {
      sql += ' AND j.title LIKE ?';
      params.push(`%${title}%`);
    }

    if (skills) {
      sql += ' AND j.skills LIKE ?';
      params.push(`%${skills}%`);
    }

    if (location && location !== 'All') {
      sql += ' AND j.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (employment_type && employment_type !== 'All') {
      sql += ' AND j.employment_type = ?';
      params.push(employment_type);
    }

    if (experience && experience !== 'All') {
      sql += ' AND j.experience_required LIKE ?';
      params.push(`%${experience}%`);
    }

    sql += ' ORDER BY j.posted_date DESC, j.id DESC';

    let jobs = await db.query(sql, params);

    // Apply memory filters if using fallback store
    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter(j =>
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.company_name && j.company_name.toLowerCase().includes(q)) ||
        (j.description && j.description.toLowerCase().includes(q)) ||
        (j.skills && j.skills.toLowerCase().includes(q)) ||
        (j.location && j.location.toLowerCase().includes(q))
      );
    }
    if (location && location !== 'All') {
      const l = location.toLowerCase();
      jobs = jobs.filter(j => j.location && j.location.toLowerCase().includes(l));
    }
    if (employment_type && employment_type !== 'All') {
      jobs = jobs.filter(j => j.employment_type === employment_type);
    }

    return jobs;
  },

  // Find all jobs posted by a specific recruiter
  findByRecruiterId: async (recruiterId) => {
    const sql = `
      SELECT j.*,
      (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applications_count
      FROM jobs j
      WHERE j.recruiter_id = ?
      ORDER BY j.created_at DESC
    `;
    return await db.query(sql, [recruiterId]);
  },

  // Update job posting
  update: async (id, {
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
  }) => {
    const result = await db.query(
      `UPDATE jobs SET
        title = ?, company_name = ?, description = ?, requirements = ?,
        skills = ?, location = ?, employment_type = ?, salary = ?,
        experience_required = ?, last_date = ?, status = ?
      WHERE id = ?`,
      [
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
        status,
        id
      ]
    );
    return result.affectedRows > 0;
  },

  // Update status only (Active / Closed)
  updateStatus: async (id, status) => {
    const result = await db.query('UPDATE jobs SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  // Delete job posting by ID
  delete: async (id) => {
    const result = await db.query('DELETE FROM jobs WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Count jobs total or by status
  count: async (status = null) => {
    let sql = 'SELECT COUNT(*) as count FROM jobs';
    let params = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    const rows = await db.query(sql, params);
    return rows && rows.length > 0 ? rows[0].count : 0;
  },

  // Count jobs by employment type
  countByEmploymentType: async (employmentType) => {
    const rows = await db.query('SELECT COUNT(*) as count FROM jobs WHERE employment_type = ?', [employmentType]);
    return rows && rows.length > 0 ? rows[0].count : 0;
  }
};

module.exports = Job;
