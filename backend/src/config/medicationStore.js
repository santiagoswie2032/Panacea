/**
 * Panacea — JSON File-based Medication Store
 * Replaces MongoDB for simple file-based architecture.
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const MEDICATIONS_FILE = path.join(DATA_DIR, 'medications.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(MEDICATIONS_FILE)) {
    fs.writeFileSync(MEDICATIONS_FILE, '[]', 'utf8');
}

const readMedications = () => {
    try {
        return JSON.parse(fs.readFileSync(MEDICATIONS_FILE, 'utf8'));
    } catch {
        return [];
    }
};

const writeMedications = (medications) => {
    fs.writeFileSync(MEDICATIONS_FILE, JSON.stringify(medications, null, 2), 'utf8');
};

module.exports = {
    find: (query) => {
        const meds = readMedications();
        if (query.userId) {
            let userMeds = meds.filter((m) => m.userId === query.userId);
            if (userMeds.length === 0) {
                // add 3 dummy medications
                const dummyMeds = [
                    {
                        _id: uuidv4(),
                        userId: query.userId,
                        name: 'Aspirin',
                        dosage: '81mg',
                        timings: ['08:00'],
                        remainingStock: 30,
                        totalStock: 30,
                        instructions: 'Take with food',
                        active: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: uuidv4(),
                        userId: query.userId,
                        name: 'Lisinopril',
                        dosage: '10mg',
                        timings: ['08:00', '20:00'],
                        remainingStock: 15,
                        totalStock: 30,
                        instructions: 'Take on an empty stomach',
                        active: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: uuidv4(),
                        userId: query.userId,
                        name: 'Atorvastatin',
                        dosage: '20mg',
                        timings: ['21:00'],
                        remainingStock: 5,
                        totalStock: 30,
                        instructions: 'Take before bedtime',
                        active: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    }
                ];
                meds.push(...dummyMeds);
                writeMedications(meds);
                return dummyMeds;
            }
            return userMeds;
        }
        return meds;
    },
    findOne: (query) => {
        const meds = readMedications();
        return meds.find((m) => m._id === query._id && (!query.userId || m.userId === query.userId));
    },
    findByIdAndUpdate: (id, updates) => {
        const meds = readMedications();
        const idx = meds.findIndex((m) => m._id === id);
        if (idx === -1) return null;
        meds[idx] = { ...meds[idx], ...updates, updatedAt: new Date().toISOString() };
        writeMedications(meds);
        return meds[idx];
    },
    findOneAndUpdate: (query, updates) => {
        const meds = readMedications();
        const idx = meds.findIndex((m) => m._id === query._id && m.userId === query.userId);
        if (idx === -1) return null;
        meds[idx] = { ...meds[idx], ...updates, updatedAt: new Date().toISOString() };
        writeMedications(meds);
        return meds[idx];
    },
    findOneAndDelete: (query) => {
        const meds = readMedications();
        const idx = meds.findIndex((m) => m._id === query._id && m.userId === query.userId);
        if (idx === -1) return null;
        const deleted = meds[idx];
        meds.splice(idx, 1);
        writeMedications(meds);
        return deleted;
    },
    create: (data) => {
        const meds = readMedications();
        const med = { _id: uuidv4(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        meds.push(med);
        writeMedications(meds);
        return med;
    },
};
