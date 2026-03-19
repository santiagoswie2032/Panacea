/**
 * Debug Script for Auth Login
 * Run with: node scripts/debugLogin.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Mock config
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const config = {
    mongoUri: process.env.MONGODB_URI,
    jwt: {
        secret: process.env.JWT_SECRET || 'panacea-dev-secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
};

const User = require('../src/models/User');

async function debug() {
    console.log('--- Auth Debug Start ---');
    console.log('MongoDB URI:', config.mongoUri.split('@').pop());
    
    try {
        await mongoose.connect(config.mongoUri);
        console.log('✅ Connected to MongoDB');

        const email = 'santiago'; // The username from screenshot
        const password = 'San12345';

        console.log(`Searching for user: ${email}`);
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        
        if (!user) {
            console.log('❌ User not found');
            // Try searching by name just in case
            const userByName = await User.findOne({ name: 'santiago' }).select('+password');
            if (userByName) {
                console.log('✅ User found by name! Email is:', userByName.email);
            }
        } else {
            console.log('✅ User found. Comparing passwords...');
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', isMatch);

            if (isMatch) {
                console.log('Generating token...');
                const token = jwt.sign({ userId: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
                console.log('✅ Token generated successfully');
            }
        }

    } catch (err) {
        console.error('❌ Debug Error:', err.message);
        console.error(err.stack);
    } finally {
        await mongoose.disconnect();
        console.log('--- Debug End ---');
    }
}

debug();
