const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config/env');
const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const medicationRoutes = require('./routes/medications');
const documentRoutes = require('./routes/documents');
const notificationRoutes = require('./routes/notifications');
const userRoutes = require('./routes/users');

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS — must allow credentials for cookies
// the FRONTEND_URL variable can be a single origin or a comma-separated
// list of allowed origins (handy if you deploy frontend & backend to
// different domains/branches).  we construct a function that checks the
// incoming origin against the list.
let allowedOrigins = (config.frontendUrl || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

// automatically allow the Vercel-deployed frontend when running on Vercel
if (process.env.VERCEL_URL) {
    const vercelOrigin = `https://${process.env.VERCEL_URL}`;
    if (!allowedOrigins.includes(vercelOrigin)) {
        allowedOrigins.push(vercelOrigin);
    }
}

console.log('CORS allowed origins:', allowedOrigins);

app.use(
    cors({
        origin: function (origin, callback) {
            // log for debugging; CORS failures are opaque on the client
            console.debug('CORS check - incoming origin:', origin, 'allowed:', allowedOrigins);

            // when origin is undefined (e.g. curl or same-origin requests), allow it
            if (!origin) return callback(null, true);
            
            // in development, be permissive (allow any origin)
            if (config.nodeEnv === 'development') {
                return callback(null, true);
            }
            
            // in production, strictly check against whitelist
            if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            // not allowed
            return callback(new Error('CORS policy violation'), false);
        },
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
app.use('/api/medications', medicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Panacea API is running 🏥', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
    app.listen(config.port, () => {
        console.log(`\n🏥  Panacea API Server`);
        console.log(`   Mode    : ${config.nodeEnv}`);
        console.log(`   Port    : ${config.port}`);
        console.log(`   URL     : http://localhost:${config.port}`);
        console.log(`   Frontend: ${config.frontendUrl}`);
        console.log(`   Database: MongoDB\n`);
    });
}).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
