require('dotenv').config();

const connectDB = require('../src/config/database');
const User = require('../src/models/User');

const rawEmail = process.argv[2];

if (!rawEmail) {
    console.error('Usage: node scripts/deleteUser.js <email>');
    process.exit(1);
}

const email = rawEmail.toLowerCase().trim();

(async () => {
    try {
        await connectDB();
        const result = await User.deleteMany({ email });
        console.log(`Deleted ${result.deletedCount} user(s) with email "${email}"`);
    } catch (err) {
        console.error('Error deleting user:', err.message);
    } finally {
        process.exit(0);
    }
})();

