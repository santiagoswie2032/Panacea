/**
 * Panacea — JSON File-based Notification Store
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    fs.writeFileSync(NOTIFICATIONS_FILE, '[]', 'utf8');
}

const readNotifications = () => {
    try {
        return JSON.parse(fs.readFileSync(NOTIFICATIONS_FILE, 'utf8'));
    } catch {
        return [];
    }
};

const writeNotifications = (notif) => {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notif, null, 2), 'utf8');
};

module.exports = {
    find: (query) => {
        const notifs = readNotifications();
        if (query.userId) {
            return notifs.filter((n) => n.userId === query.userId);
        }
        return notifs;
    },
    findByIdAndUpdate: (id, updates) => {
        const notifs = readNotifications();
        const idx = notifs.findIndex((n) => n._id === id);
        if (idx === -1) return null;
        notifs[idx] = { ...notifs[idx], ...updates, updatedAt: new Date().toISOString() };
        writeNotifications(notifs);
        return notifs[idx];
    },
    create: (data) => {
        const notifs = readNotifications();
        const notif = { _id: uuidv4(), ...data, read: false, createdAt: new Date().toISOString() };
        notifs.push(notif);
        writeNotifications(notifs);
        return notif;
    },
};
