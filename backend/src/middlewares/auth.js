/**
 * Panacea — Auth Middleware
 * Reads JWT from httpOnly cookie first, then falls back to Authorization Bearer header.
 * Validates JWT and fetches user from MongoDB.
 */

const jwt = require('jsonwebtoken');
const config = require('../config/env');
const userStore = require('../config/userStore');

const auth = async (req, res, next) => {
    try {
        // 1. Try cookie
        let token = req.cookies && req.cookies.token;

        // 2. Fallback to Authorization header (e.g. Postman / API testing)
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await userStore.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found.' });
        }

        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired.' });
        }
        return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

module.exports = auth;
