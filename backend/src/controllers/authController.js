/**
 * Panacea — Auth Controller
 * Cookie-based JWT auth, users stored in JSON file (no database).
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const userStore = require('../config/userStore');
const config = require('../config/env');

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.nodeEnv === 'production',
    maxAge: config.jwt.cookieExpiresDays * 24 * 60 * 60 * 1000,
    path: '/',
};

const generateToken = (userId) =>
    jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

const sanitizeUser = (user) => {
    const { password, ...safe } = user;
    return safe;
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        }

        if (userStore.findByEmail(email)) {
            return res.status(409).json({ success: false, message: 'Email is already registered.' });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = userStore.create({
            id: uuidv4(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashed,
            createdAt: new Date().toISOString(),
        });

        const token = generateToken(user.id);
        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(201).json({ success: true, data: { user: sanitizeUser(user) } });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const user = userStore.findByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = generateToken(user.id);
        res.cookie('token', token, COOKIE_OPTIONS);

        return res.json({ success: true, data: { user: sanitizeUser(user) } });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
    res.clearCookie('token', { path: '/' });
    return res.json({ success: true, message: 'Logged out successfully.' });
};

// GET /api/auth/me
exports.me = (req, res) => {
    return res.json({ success: true, data: { user: sanitizeUser(req.user) } });
};
