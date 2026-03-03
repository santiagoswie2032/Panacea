/**
 * Panacea — JSON File-based Dose Record Store
 */

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DOSE_RECORDS_FILE = path.join(DATA_DIR, 'doseRecords.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DOSE_RECORDS_FILE)) {
    fs.writeFileSync(DOSE_RECORDS_FILE, '[]', 'utf8');
}

const readRecords = () => {
    try {
        return JSON.parse(fs.readFileSync(DOSE_RECORDS_FILE, 'utf8'));
    } catch {
        return [];
    }
};

const writeRecords = (records) => {
    fs.writeFileSync(DOSE_RECORDS_FILE, JSON.stringify(records, null, 2), 'utf8');
};

const doseRecordStore = {
    findOne: (query) => {
        const records = readRecords();
        return records.find(
            (r) =>
                r.medicationId === query.medicationId &&
                r.userId === query.userId &&
                r.scheduledTime === query.scheduledTime &&
                r.date === query.date
        );
    },
    findByDate: (date, userId) => {
        const records = readRecords();
        return records.filter((r) => r.date === date && r.userId === userId);
    },
    create: (data) => {
        const records = readRecords();
        const record = { _id: uuidv4(), ...data, createdAt: new Date().toISOString() };
        records.push(record);
        writeRecords(records);
        return record;
    },
    updateById: (id, updates) => {
        const records = readRecords();
        const idx = records.findIndex((r) => r._id === id);
        if (idx === -1) return null;
        records[idx] = { ...records[idx], ...updates, updatedAt: new Date().toISOString() };
        writeRecords(records);
        return records[idx];
    },
    deleteByMedicationId: (medicationId) => {
        const records = readRecords();
        const filtered = records.filter((r) => r.medicationId !== medicationId);
        writeRecords(filtered);
    },
};

export default doseRecordStore;
