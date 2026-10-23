
const express = require('express');
const NewsController = require('../controllers/news.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', NewsController.getAll);
router.get('/slug/:slug', NewsController.getBySlug);
router.get('/author/:authorId', NewsController.getByAuthorId);
router.get('/:id', NewsController.getById);
router.post('/', AuthMiddleware, NewsController.create);
router.put('/:id', AuthMiddleware, NewsController.update);
router.delete('/:id', AuthMiddleware, NewsController.delete);

module.exports = router;
