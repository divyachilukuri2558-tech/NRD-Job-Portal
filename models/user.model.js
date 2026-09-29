const db = require('../db/db.js');

// User Model encapsulating MySQL operations for the `users` table
const User = {
  // Create a new user
  create: async ({ name, email, password, role, phone }) => {
    const result = await db.query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role || 'seeker', phone || null]
    );
    return {
      id: result.insertId,
      name,
      email,
      role: role || 'seeker',
      phone: phone || null
    };
  },

  // Find user by email (includes password for authentication verification)
  findByEmail: async (email) => {
    const rows = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Find user by ID (excludes sensitive password hash)
  findById: async (id) => {
    const rows = await db.query(
      'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows && rows.length > 0 ? rows[0] : null;
  },

  // Update user basic profile information (name, phone)
  update: async (id, { name, phone }) => {
    const result = await db.query(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name, phone || null, id]
    );
    return result.affectedRows > 0;
  },

  // Retrieve all users (with optional role filter)
  findAll: async (role = null) => {
    let sql = 'SELECT id, name, email, role, phone, created_at FROM users';
    let params = [];

    if (role && ['seeker', 'recruiter', 'admin'].includes(role)) {
      sql += ' WHERE role = ?';
      params.push(role);
    }
    sql += ' ORDER BY created_at DESC';

    return await db.query(sql, params);
  },

  // Delete user by ID (cascades to seeker/recruiter in database)
  delete: async (id) => {
    const result = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Count total users or count by role
  count: async (role = null) => {
    let sql = 'SELECT COUNT(*) as count FROM users';
    let params = [];

    if (role) {
      sql += ' WHERE role = ?';
      params.push(role);
    }

    const rows = await db.query(sql, params);
    return rows && rows.length > 0 ? rows[0].count : 0;
  }
};

module.exports = User;
