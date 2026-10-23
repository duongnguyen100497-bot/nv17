const TokenHelper = require('../helper/token');

const AuthMiddleware = (req, res, next) => {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
        return res.status(401).json({
            message: 'Missing access token'
        });
    }

    try {
        const user = TokenHelper.verifyAccessToken(accessToken);

        req.user = user;

        return next();
    } catch (e) {
        return res.status(401).json({
            message: 'Invalid or expired access token'
        });
    }
};

module.exports = AuthMiddleware;