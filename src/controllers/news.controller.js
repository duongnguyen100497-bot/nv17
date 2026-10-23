
const News = require('../models/news.model');

const NewsController = {
  // GET /api/v1/news
  async getAll(req, res) {
    try {
      const news = await News.findAll();

      return res.status(200).json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Get all news error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // GET /api/v1/news/:id
  async getById(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid news ID',
        });
      }

      const news = await News.findById(id);

      if (!news) {
        return res.status(404).json({
          success: false,
          message: 'News not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Get news error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // GET /api/v1/news/slug/:slug
  async getBySlug(req, res) {
    try {
      const { slug } = req.params;

      if (!slug) {
        return res.status(400).json({
          success: false,
          message: 'Slug is required',
        });
      }

      const news = await News.findBySlug(slug);

      if (!news) {
        return res.status(404).json({
          success: false,
          message: 'News not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Get news by slug error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // GET /api/v1/news/author/:authorId
  async getByAuthorId(req, res) {
    try {
      const authorId = Number(req.params.authorId);

      if (!Number.isSafeInteger(authorId) || authorId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid author ID',
        });
      }

      const news = await News.findByAuthorId(authorId);

      return res.status(200).json({
        success: true,
        data: news,
      });
    } catch (error) {
      console.error('Get news by author error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // POST /api/v1/news
  async create(req, res) {
    try {
      const {
        title,
        slug,
        summary,
        content,
        status = 'draft',
        publishedAt = null
      } = req.body;
      const authorId = req.user.sub
      if (!authorId || !title || !slug || !content) {
        return res.status(400).json({
          success: false,
          message: 'authorId, title, slug and content are required',
        });
      }

      const parsedAuthorId = Number(authorId);

      if (!Number.isSafeInteger(parsedAuthorId) || parsedAuthorId <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid author ID',
        });
      }

      if (!['draft', 'published'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid news status',
        });
      }

      const existingNews = await News.findBySlug(slug);

      if (existingNews) {
        return res.status(409).json({
          success: false,
          message: 'Slug already exists',
        });
      }

      const news = await News.create({
        authorId: parsedAuthorId,
        title,
        slug,
        summary,
        content,
        status,
        publishedAt
      });

      return res.status(201).json({
        success: true,
        message: 'News created successfully',
        data: news,
      });
    } catch (error) {
      console.error('Create news error:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Slug already exists',
        });
      }

      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          message: 'Author does not exist',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // PUT /api/v1/news/:id
  async update(req, res) {
    try {
      const id = Number(req.params.id);

      const {
        title,
        slug,
        summary,
        content,
        status,
        publishedAt
      } = req.body;

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid news ID',
        });
      }

      if (!title || !slug || !content || !status) {
        return res.status(400).json({
          success: false,
          message: 'Title, slug, content and status are required',
        });
      }

      if (!['draft', 'published'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid news status',
        });
      }

      const existingNews = await News.findById(id);

      if (!existingNews) {
        return res.status(404).json({
          success: false,
          message: 'News not found',
        });
      }

      const newsWithSlug = await News.findBySlug(slug);

      if (newsWithSlug && Number(newsWithSlug.id) !== id) {
        return res.status(409).json({
          success: false,
          message: 'Slug already exists',
        });
      }

      const news = await News.update(id, {
        title,
        slug,
        summary,
        content,
        status,
        publishedAt
      });

      return res.status(200).json({
        success: true,
        message: 'News updated successfully',
        data: news,
      });
    } catch (error) {
      console.error('Update news error:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Slug already exists',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // DELETE /api/v1/news/:id
  async delete(req, res) {
    try {
      const id = Number(req.params.id);

      if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid news ID',
        });
      }

      const deleted = await News.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'News not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'News deleted successfully',
      });
    } catch (error) {
      console.error('Delete news error:', error);

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },
};

module.exports = NewsController;
