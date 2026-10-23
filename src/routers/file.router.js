
const express = require('express');
const FileController = require('../controllers/file.controller');

const router = express.Router();

router.get('/', FileController.getAll);
router.get('/uploader/:uploaderId', FileController.getByUploaderId);
router.get('/:id', FileController.getById);
router.post('/', FileController.create);
router.put('/:id', FileController.update);
router.delete('/:id', FileController.delete);

module.exports = router;
