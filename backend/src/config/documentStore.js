/**
 * Panacea — JSON File-based Document Store
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DOCUMENTS_FILE)) {
    fs.writeFileSync(DOCUMENTS_FILE, '[]', 'utf8');
}

const readDocuments = () => {
    try {
        return JSON.parse(fs.readFileSync(DOCUMENTS_FILE, 'utf8'));
    } catch {
        return [];
    }
};

const writeDocuments = (docs) => {
    fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(docs, null, 2), 'utf8');
};

const documentStore = {
    find: (query) => {
        const docs = readDocuments();
        if (query.userId) {
            return docs.filter((d) => d.userId === query.userId);
        }
        return docs;
    },
    findById: (id) => {
        const docs = readDocuments();
        return docs.find((d) => d._id === id);
    },
    findByIdAndDelete: (id) => {
        const docs = readDocuments();
        const idx = docs.findIndex((d) => d._id === id);
        if (idx === -1) return null;
        const deleted = docs[idx];
        docs.splice(idx, 1);
        writeDocuments(docs);
        return deleted;
    },
    findByIdAndUpdate: (id, updates) => {
        const docs = readDocuments();
        const idx = docs.findIndex((d) => d._id === id);
        if (idx === -1) return null;
        docs[idx] = { ...docs[idx], ...updates, updatedAt: new Date().toISOString() };
        writeDocuments(docs);
        return docs[idx];
    },
    create: (data) => {
        const docs = readDocuments();
        const doc = { _id: uuidv4(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        docs.push(doc);
        writeDocuments(docs);
        return doc;
    },
};

export default documentStore;
