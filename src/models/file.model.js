
const pool = require('../config/database');

const File = {
  async findAll() {
    const [rows] = await pool.execute(
      `SELECT f.id, f.uploaded_by, f.original_name,
              f.storage_key, f.mime_type, f.size_bytes,
              f.created_at, u.full_name AS uploader_name
       FROM files f
       JOIN users u ON f.uploaded_by = u.id
       ORDER BY f.id DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT f.id, f.uploaded_by, f.original_name,
              f.storage_key, f.mime_type, f.size_bytes,
              f.created_at, u.full_name AS uploader_name
       FROM files f
       JOIN users u ON f.uploaded_by = u.id
       WHERE f.id = ?
       LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  async findByStorageKey(storageKey) {
    const [rows] = await pool.execute(
      `SELECT id, uploaded_by, original_name,
              storage_key, mime_type, size_bytes,
              created_at
       FROM files
       WHERE storage_key = ?
       LIMIT 1`,
      [storageKey]
    );
    return rows[0] || null;
  },

  async findByUploaderId(uploaderId) {
    const [rows] = await pool.execute(
      `SELECT id, uploaded_by, original_name,
              storage_key, mime_type, size_bytes,
              created_at
       FROM files
       WHERE uploaded_by = ?
       ORDER BY id DESC`,
      [uploaderId]
    );
    return rows;
  },

  async create({
    uploadedBy,
    originalName,
    storageKey,
    mimeType,
    sizeBytes
  }) {
    const [result] = await pool.execute(
      `INSERT INTO files
       (uploaded_by, original_name, storage_key,
        mime_type, size_bytes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        uploadedBy,
        originalName,
        storageKey,
        mimeType,
        sizeBytes
      ]
    );

    return this.findById(result.insertId);
  },

  async update(id, {
    originalName,
    storageKey,
    mimeType,
    sizeBytes
  }) {
    const [result] = await pool.execute(
      `UPDATE files
       SET original_name = ?,
           storage_key = ?,
           mime_type = ?,
           size_bytes = ?
       WHERE id = ?`,
      [
        originalName,
        storageKey,
        mimeType,
        sizeBytes,
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
      `DELETE FROM files WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }
};

module.exports = File;
