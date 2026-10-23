
const File = require('../models/file.model');

const FileController = {
  // GET /api/v1/files
  async getAll(req, res) {
    try {
      const files = await File.findAll();

      return res.status(200).json({
        success: true,
        data: files,
      });
    } catch (error) {
      console.error('Get all files error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // GET /api/v1/files/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file ID',
        });
      }

      const file = await File.findById(id);

      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'File not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: file,
      });
    } catch (error) {
      console.error('Get file error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // GET /api/v1/files/uploader/:uploaderId
  async getByUploaderId(req, res) {
    try {
      const uploaderId = Number(req.params.uploaderId);

      if (!Number.isSafeInteger(uploaderId) || uploaderId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid uploader ID',
        });
      }

      const files = await File.findByUploaderId(uploaderId);

      return res.status(200).json({
        success: true,
        data: files,
      });
    } catch (error) {
      console.error('Get files by uploader error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // POST /api/v1/files
  async create(req, res) {
    try {
      const {
        originalName,
        storageKey,
        mimeType,
        sizeBytes
      } = req.body;
      const uploadedBy = req.user.sub;
      if (
        uploadedBy == null ||
        !originalName ||
        !storageKey ||
        !mimeType ||
        sizeBytes == null
      ) {
        return res.status(400).json({
          success: false,
          message: 'uploadedBy, originalName, storageKey, mimeType and sizeBytes are required',
        });
      }

      const parsedUploadedBy = Number(uploadedBy);
      const parsedSizeBytes = Number(sizeBytes);

      if (
        !Number.isSafeInteger(parsedUploadedBy) ||
        parsedUploadedBy <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid uploadedBy',
        });
      }

      if (
        !Number.isSafeInteger(parsedSizeBytes) ||
        parsedSizeBytes < 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid sizeBytes',
        });
      }

      const existingFile = await File.findByStorageKey(storageKey);

      if (existingFile) {
        return res.status(409).json({
          success: false,
          message: 'Storage key already exists',
        });
      }

      const file = await File.create({
        uploadedBy: parsedUploadedBy,
        originalName,
        storageKey,
        mimeType,
        sizeBytes: parsedSizeBytes
      });

      return res.status(201).json({
        success: true,
        message: 'File created successfully',
        data: file,
      });
    } catch (error) {
      console.error('Create file error:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Storage key already exists',
        });
      }

      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          message: 'Uploader does not exist',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // PUT /api/v1/files/:id
  async update(req, res) {
    try {
      const id = Number(req.params.id);

      const {
        originalName,
        storageKey,
        mimeType,
        sizeBytes
      } = req.body;

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file ID',
        });
      }

      if (
        !originalName ||
        !storageKey ||
        !mimeType ||
        sizeBytes == null
      ) {
        return res.status(400).json({
          success: false,
          message: 'originalName, storageKey, mimeType and sizeBytes are required',
        });
      }

      const parsedSizeBytes = Number(sizeBytes);

      if (
        !Number.isSafeInteger(parsedSizeBytes) ||
        parsedSizeBytes < 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid sizeBytes',
        });
      }

      const existingFile = await File.findById(id);

      if (!existingFile) {
        return res.status(404).json({
          success: false,
          message: 'File not found',
        });
      }

      const fileWithStorageKey =
        await File.findByStorageKey(storageKey);

      if (
        fileWithStorageKey &&
        Number(fileWithStorageKey.id) !== id
      ) {
        return res.status(409).json({
          success: false,
          message: 'Storage key already exists',
        });
      }

      const file = await File.update(id, {
        originalName,
        storageKey,
        mimeType,
        sizeBytes: parsedSizeBytes
      });

      return res.status(200).json({
        success: true,
        message: 'File updated successfully',
        data: file,
      });
    } catch (error) {
      console.error('Update file error:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Storage key already exists',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // DELETE /api/v1/files/:id
  async delete(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file ID',
        });
      }

      const deleted = await File.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'File not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      console.error('Delete file error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },
};

module.exports = FileController;
