const pool = require('../config/database');

const User = {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT id, email, full_name, created_at, updated_at
       FROM users
       ORDER BY id DESC`
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, email, full_name, created_at, updated_at
       FROM users
       WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute(
      `SELECT id, email, password_hash, full_name,
              created_at, updated_at
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    return rows[0] || null;
  },

  async create({ email, passwordHash, fullName }) {
    const [result] = await pool.execute(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES (?, ?, ?)`,
      [email, passwordHash, fullName]
    );

    return this.findById(result.insertId);
  },

  async update(id, { email, fullName }) {
    const [result] = await pool.execute(
      `UPDATE users
       SET email = ?, full_name = ?
       WHERE id = ?`,
      [email, fullName, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(id);
  },

  async updatePassword(id, passwordHash) {
    const [result] = await pool.execute(
      `UPDATE users
       SET password_hash = ?
       WHERE id = ?`,
      [passwordHash, id]
    );

    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  },
};

module.exports = User;