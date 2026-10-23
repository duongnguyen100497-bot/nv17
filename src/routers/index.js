const express = require('express');
const router = express.Router();
const UserRouter = require('./user.router');
const AuthRouter = require('./auth.router');
const NewsRouter = require('./news.router');
const FileRouter = require('./file.router')

router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/news', NewsRouter);
router.use('/files', FileRouter)

module.exports = router;