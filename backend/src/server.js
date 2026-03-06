import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';


import config from './config/env.js';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import medicationRoutes from './routes/medications.js';
import documentRoutes from './routes/documents.js';
import notificationRoutes from './routes/notifications.js';
import userRoutes from './routes/users.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
