/**
 * Panacea — API Service (cookie-based auth)
 * All requests include credentials so the browser sends the httpOnly JWT cookie.
 * Auth token management is handled entirely by the server-side cookie.
 */

// In development we proxy `/api` to the backend server, but once
// the app is deployed the API may live on a different host.  The
// Vite build system exposes environment variables prefixed with
// `VITE_` under `import.meta.env`.
//
// On Vercel you should define VITE_API_BASE pointing at your
// backend URL (e.g. https://panacea-backend.vercel.app).  Falling
// back to '/api' keeps the local proxy behavior intact.
// if a specific API base is provided via env var, use it; otherwise
// look for VERCEL_URL (useful when backend is deployed as a serverless
// function in the same Vercel project).  Falling back to '/api' keeps the
// local dev proxy working.
const API_BASE =
    import.meta.env.VITE_API_BASE ||
    (import.meta.env.VERCEL_URL ? `https://${import.meta.env.VERCEL_URL}` : '/api');

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = { ...options.headers };

        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                credentials: 'include', // Always send the JWT cookie
            });

            // parse JSON only when appropriate, guard against empty/non-JSON bodies
            let data = null;
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                try {
                    data = await response.json();
                } catch (err) {
                    // invalid JSON body (maybe an HTML error page or empty response)
                    console.warn('API returned non-json response', err);
                    data = null;
                }
            } else {
                // fallback: attempt to read text and parse
                const text = await response.text();
                try {
                    data = text ? JSON.parse(text) : null;
                } catch {
                    data = null;
                }
            }

            if (!response.ok) {
                if (response.status === 401 && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                // if we have parsed data with a message use it, otherwise fall back
                const msg = data && data.message ? data.message : 'Something went wrong';
                throw new Error(msg);
            }

            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Network error. Please check your connection.');
            }
            throw error;
        }
    }

    get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
    post(endpoint, body) {
        const options = { method: 'POST' };
        if (body instanceof FormData) {
            options.body = body;
        } else {
            options.body = JSON.stringify(body);
        }
        return this.request(endpoint, options);
    }
    put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
    }
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }

    // Auth endpoints
    register(data) { return this.post('/auth/register', data); }
    login(data) { return this.post('/auth/login', data); }
    logout() { return this.post('/auth/logout'); }
    getMe() { return this.get('/auth/me'); }

    // Medication endpoints
    getMedications() { return this.get('/medications'); }
    getMedication(id) { return this.get(`/medications/${id}`); }
    createMedication(data) { return this.post('/medications', data); }
    updateMedication(id, data) { return this.put(`/medications/${id}`, data); }
    deleteMedication(id) { return this.delete(`/medications/${id}`); }
    getTodaySchedule() { return this.get('/medications/schedule/today'); }
    takeDose(data) { return this.post('/medications/dose/take', data); }

    // Document endpoints
    getDocuments(category = '') { 
        const url = category ? `/documents?category=${category}` : '/documents';
        return this.get(url); 
    }
    getDocument(id) { return this.get(`/documents/${id}`); }
    getDocumentUrl(id) { return `${API_BASE}/documents/${id}/download`; }
    uploadDocument(formData) { return this.post('/documents/upload', formData); }
    renameDocument(id, name) { return this.put(`/documents/${id}`, { name }); }
    deleteDocument(id) { return this.delete(`/documents/${id}`); }

    // Notification endpoints
    getNotifications() { return this.get('/notifications'); }
    markNotificationAsRead(id) { return this.put(`/notifications/${id}`, { read: true }); }

    // User endpoints
    updateProfile(data) { return this.put('/users/profile', data); }
    uploadProfilePicture(formData) { return this.post('/users/profile-picture', formData); }
    getEmergencyInfo() { return this.get('/users/emergency'); }
    updateEmergencyInfo(data) { return this.put('/users/emergency', data); }

    // Boxes endpoints — Digitized medication storage tracking
    // Get all boxes with their medications
    getBoxes() { return this.get('/boxes'); }
    // Get a single box by ID
    getBox(id) { return this.get(`/boxes/${id}`); }
    // Create a new box
    createBox(data) { return this.post('/boxes', data); }
    // Update a box (e.g., rename it)
    updateBox(id, data) { return this.put(`/boxes/${id}`, data); }
    // Delete a box and all its medications
    deleteBox(id) { return this.delete(`/boxes/${id}`); }
    // Add a medication to a specific box
    addMedicationToBox(boxId, medicationData) { 
        return this.post(`/boxes/${boxId}/medications`, medicationData); 
    }
    // Update a medication within a box
    updateBoxMedication(boxId, medicationId, data) { 
        return this.put(`/boxes/${boxId}/medications/${medicationId}`, data); 
    }
    // Delete a medication from a box
    deleteBoxMedication(boxId, medicationId) { 
        return this.delete(`/boxes/${boxId}/medications/${medicationId}`); 
    }
}

const api = new ApiService();
export default api;
