/**
 * Panacea — API Service (cookie-based auth)
 * All requests include credentials so the browser sends the httpOnly JWT cookie.
 * Auth token management is handled entirely by the server-side cookie.
 */

const API_BASE = '/api';

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

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 && window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                throw new Error(data.message || 'Something went wrong');
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
}

const api = new ApiService();
export default api;
