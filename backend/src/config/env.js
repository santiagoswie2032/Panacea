import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/panacea',
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET || 'panacea-dev-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        cookieExpiresDays: parseInt(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7,
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    upload: {
        dir: process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads'),
    },
};

export default config;
