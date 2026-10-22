const express = require('express');
const router = express.Router();
const UserRouter = require('./user.router');
const AuthRouter = require('./auth.router')

router.use('/users', UserRouter);
router.use('/auth', AuthRouter);

module.exports = router;