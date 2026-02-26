require('dotenv').config();

const connectDB = require('../src/config/database');
const User = require('../src/models/User');

const [, , nameArg, emailArg, passwordArg] = process.argv;

if (!nameArg || !emailArg || !passwordArg) {
    console.error('Usage: node scripts/createUser.js "<name>" "<email>" "<password>"');
    process.exit(1);
}

const name = nameArg.trim();
const email = emailArg.toLowerCase().trim();
const password = passwordArg;

(async () => {
    try {
        await connectDB();

        const existing = await User.findOne({ email });
        if (existing) {
            console.log(`User with email "${email}" already exists (id=${existing._id}).`);
            process.exit(0);
        }

        const user = new User({ name, email, password });
        await user.save(); // password will be hashed by pre-save hook

        console.log('Created user:');
        console.log(`  id   : ${user._id}`);
        console.log(`  name : ${user.name}`);
        console.log(`  email: ${user.email}`);
    } catch (err) {
        console.error('Error creating user:', err.message);
    } finally {
        process.exit(0);
    }
})();

