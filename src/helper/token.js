
const jwt = require('jsonwebtoken');

const TokenHelper = {
  signAccessToken(user) {
    return jwt.sign(
      {
        sub: String(user.id),
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        issuer: 'news-api',
        audience: 'news-api-client',
      }
    );
  },

  verifyAccessToken(token) {
    return jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        issuer: 'news-api',
        audience: 'news-api-client',
      }
    );
  },
};

module.exports = TokenHelper;
