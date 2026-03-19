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

/* =========================
   Security
========================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

/* =========================
   CORS Configuration
========================= */

// FRONTEND_URL can be comma-separated
let allowedOrigins = (config.frontendUrl || '')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

// Log allowed origins on startup
console.log('CORS allowed origins:', allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      console.debug(
        'CORS check - incoming origin:',
        origin,
        'allowed:',
        allowedOrigins
      );

      // Allow requests without origin (curl, same-origin, server-to-server)
      if (!origin) return callback(null, true);

      // Development: allow everything
      if (config.nodeEnv === 'development') {
        return callback(null, true);
      }

      // Production: strict whitelist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS policy violation'), false);
    },
    credentials: true,
  })
);

/* =========================
   Rate Limiting
========================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use('/api/', limiter);

/* =========================
   Body Parsing
========================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   Cookies
========================= */
app.use(cookieParser());

/* =========================
   Logging (dev only)
========================= */
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

/* =========================
   Static Files
========================= */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/* =========================
   API Routes
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

/* =========================
   Health Check
========================= */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Panacea API is running 🏥',
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   Error Handler
========================= */
app.use(errorHandler);

/* =========================
   Database Init (Serverless-safe)
========================= */
connectDB().catch((err) => {
  console.error('❌ MongoDB connection failed:', err);
});

/* =========================
   EXPORT APP (IMPORTANT)
   Vercel will handle the server
========================= */
module.exports = app;

if (require.main === module) {
  const PORT = config.port || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
    console.log(`👉 Access via: http://localhost:${PORT}`);
    console.log(`🔌 MongoDB: ${config.mongoUri.split('@').pop()}`); // hide credentials if any
  });
}
