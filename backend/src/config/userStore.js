/**
 * Panacea — JSON File-based User Store
 * Replaces MongoDB/Mongoose for simple localStorage-first architecture.
 * Users are persisted to data/users.json so they survive server restarts.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf8');
}

const readUsers = () => {
    try {
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch {
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
};

module.exports = {
    findByEmail: (email) => readUsers().find((u) => u.email === email.toLowerCase()),
    findById: (id) => readUsers().find((u) => u.id === id),
    create: (user) => {
        const users = readUsers();
        users.push(user);
        writeUsers(users);
        return user;
    },
    updateById: (id, updates) => {
        const users = readUsers();
        const idx = users.findIndex((u) => u.id === id);
        if (idx === -1) return null;
        users[idx] = { ...users[idx], ...updates };
        writeUsers(users);
        return users[idx];
    },
};
