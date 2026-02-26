const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const authRoutes = require('./routes/auth');

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS — must allow credentials for cookies
app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser — required for httpOnly JWT cookie auth
app.use(cookieParser());

// Logging (dev only)
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Panacea API is running 🏥', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
    console.log(`\n🏥  Panacea API Server`);
    console.log(`   Mode    : ${config.nodeEnv}`);
    console.log(`   Port    : ${config.port}`);
    console.log(`   URL     : http://localhost:${config.port}`);
    console.log(`   Frontend: ${config.frontendUrl}`);
    console.log(`   Storage : JSON file (no database)\n`);
});
