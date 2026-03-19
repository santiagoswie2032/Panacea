/**
 * Panacea — Auth Controller
 * Cookie-based JWT auth with MongoDB persistence.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userStore = require('../config/userStore');
const medicationStore = require('../config/medicationStore');
const config = require('../config/env');

// cookie configuration — Lax is fine for local dev where frontend
// and backend share origin, but in production the frontend and backend
// will often live on different domains.  In that case we must use
// SameSite=None and secure cookies so browsers will accept them.
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
    secure: config.nodeEnv === 'production',
    maxAge: config.jwt.cookieExpiresDays * 24 * 60 * 60 * 1000,
    path: '/',
};

const generateToken = (userId) =>
    jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });

const sanitizeUser = (user) => {
    return user.toJSON ? user.toJSON() : user;
};

// Seed example medications for brand new users (file-based store)
const SEED_MEDICATIONS = [
    {
        name: 'Aspirin',
        dosage: '75 mg',
        timings: ['09:00'],
        totalStock: 30,
        instructions: 'Take after breakfast with a glass of water.',
    },
    {
        name: 'Vitamin D3',
        dosage: '2000 IU',
        timings: ['08:00'],
        totalStock: 60,
        instructions: 'Take in the morning with food.',
    },
    {
        name: 'Metformin',
        dosage: '500 mg',
        timings: ['20:00'],
        totalStock: 90,
        instructions: 'Take with your evening meal.',
    },
];

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

        const existingUser = await userStore.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email is already registered.' });
        }

        const user = await userStore.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
        });

        // Seed two example medications for this new user (if using file-based medication store)
        try {
            const userId = String(user._id);
            const shuffled = [...SEED_MEDICATIONS].sort(() => 0.5 - Math.random());
            const examples = shuffled.slice(0, 2);

            examples.forEach((med) => {
                medicationStore.create({
                    userId,
                    name: med.name,
                    dosage: med.dosage,
                    timings: med.timings,
                    totalStock: med.totalStock,
                    remainingStock: med.totalStock,
                    instructions: med.instructions,
                    active: true,
                });
            });
        } catch {
            // Seeding meds is best-effort only; registration should still succeed
        }

        const token = generateToken(user._id);
        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(201).json({ success: true, data: { user: sanitizeUser(user) } });
    } catch (err) {
        next(err);
    }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
    console.log('📬 Login request received for email:', req.body.email);
    try {
        const { email, password } = req.body;
        const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : email;

        if (!normalizedEmail || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const user = await userStore.findByEmail(normalizedEmail);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = generateToken(user._id);
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
