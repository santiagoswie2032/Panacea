const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
    try {
        console.log(`🔌 Attempting to connect to MongoDB: ${config.mongoUri.split('@').pop()}...`);
        const conn = await mongoose.connect(config.mongoUri);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error:`);
        console.error(`   Message: ${error.message}`);
        console.error(`   Code: ${error.code || 'N/A'}`);
        if (error.name === 'MongoServerSelectionError') {
          console.error(`   ⚠️  This often means your current IP is NOT allowed in Atlas "Network Access".`);
        }
        process.exit(1);
    }
};

module.exports = connectDB;
