
const pool = require('../config/database');

const News = {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT n.id, n.author_id, n.title, n.slug,
              n.summary, n.content, n.status,
              n.published_at, n.created_at, n.updated_at,
              u.full_name AS author_name
       FROM news n
       JOIN users u ON n.author_id = u.id
       ORDER BY n.id DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT n.id, n.author_id, n.title, n.slug,
              n.summary, n.content, n.status,
              n.published_at, n.created_at, n.updated_at,
              u.full_name AS author_name
       FROM news n
       JOIN users u ON n.author_id = u.id
       WHERE n.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findBySlug(slug) {
    const [rows] = await pool.execute(
      `SELECT n.id, n.author_id, n.title, n.slug,
              n.summary, n.content, n.status,
              n.published_at, n.created_at, n.updated_at,
              u.full_name AS author_name
       FROM news n
       JOIN users u ON n.author_id = u.id
       WHERE n.slug = ?
       LIMIT 1`,
      [slug]
    );
    return rows[0] || null;
  },

  async findByAuthorId(authorId) {
    const [rows] = await pool.execute(
      `SELECT id, author_id, title, slug, summary,
              content, status, published_at,
              created_at, updated_at
       FROM news
       WHERE author_id = ?
       ORDER BY id DESC`,
      [authorId]
    );
    return rows;
  },

  async create({
    authorId,
    title,
    slug,
    summary,
    content,
    status = 'draft',
    publishedAt = null
  }) {
    const [result] = await pool.execute(
      `INSERT INTO news
       (author_id, title, slug, summary, content,
        status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        authorId,
        title,
        slug,
        summary ?? null,
        content,
        status,
        publishedAt
      ]
    );
    return this.findById(result.insertId);
  },

  async update(id, {
    title,
    slug,
    summary,
    content,
    status,
    publishedAt
  }) {
    const [result] = await pool.execute(
      `UPDATE news
       SET title = ?, slug = ?, summary = ?,
           content = ?, status = ?, published_at = ?
       WHERE id = ?`,
      [
        title,
        slug,
        summary ?? null,
        content,
        status,
        publishedAt ?? null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }
    return this.findById(id);
  },

  async delete(id) {
    const [result] = await pool.execute(
      `DELETE FROM news WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = News;
