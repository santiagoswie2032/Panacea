/**
 * Panacea — localStorage Data Service
 * All app data (medications, documents, profile) is persisted here.
 * Keys are namespaced per user ID so multiple accounts share a browser without collision.
 */

const PREFIX = 'panacea';

const key = (userId, namespace) => `${PREFIX}:${userId}:${namespace}`;

// --- Generic helpers ---

export const ls = {
    get: (k, fallback = null) => {
        try {
            const raw = localStorage.getItem(k);
            return raw !== null ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },
    set: (k, value) => {
        try { localStorage.setItem(k, JSON.stringify(value)); } catch { /* quota */ }
    },
    remove: (k) => localStorage.removeItem(k),
};

// --- Medications ---

export const getMedications = (userId) => ls.get(key(userId, 'medications'), []);

export const saveMedications = (userId, medications) =>
    ls.set(key(userId, 'medications'), medications);

export const addMedication = (userId, medication) => {
    const list = getMedications(userId);
    const updated = [...list, { ...medication, id: crypto.randomUUID(), createdAt: new Date().toISOString() }];
    saveMedications(userId, updated);
    return updated;
};

export const updateMedication = (userId, id, updates) => {
    const list = getMedications(userId).map((m) => m.id === id ? { ...m, ...updates } : m);
    saveMedications(userId, list);
    return list;
};

export const deleteMedication = (userId, id) => {
    const list = getMedications(userId).filter((m) => m.id !== id);
    saveMedications(userId, list);
    return list;
};

// --- Documents ---

export const getDocuments = (userId) => ls.get(key(userId, 'documents'), []);

export const saveDocuments = (userId, docs) => ls.set(key(userId, 'documents'), docs);

export const addDocument = (userId, doc) => {
    const list = getDocuments(userId);
    const updated = [...list, { ...doc, id: crypto.randomUUID(), uploadedAt: new Date().toISOString() }];
    saveDocuments(userId, updated);
    return updated;
};

export const deleteDocument = (userId, id) => {
    const list = getDocuments(userId).filter((d) => d.id !== id);
    saveDocuments(userId, list);
    return list;
};

// --- Profile / Emergency info ---

export const getProfile = (userId) => ls.get(key(userId, 'profile'), {});

export const saveProfile = (userId, profile) => ls.set(key(userId, 'profile'), profile);

// --- Dose history ---

export const getDoseHistory = (userId) => ls.get(key(userId, 'doseHistory'), []);

export const recordDose = (userId, entry) => {
    const history = getDoseHistory(userId);
    const updated = [{ ...entry, id: crypto.randomUUID(), takenAt: new Date().toISOString() }, ...history];
    ls.set(key(userId, 'doseHistory'), updated.slice(0, 500)); // keep last 500
    return updated;
};
