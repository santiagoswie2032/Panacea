/**
 * Panacea — JSON File-based User Store
 * Already handled by userStore.js but this is for the controller
 */

import userStore from './userStore.js';

const userStoreAdapter = {
    findById: (id) => {
        return userStore.findById(id);
    },
    findByEmail: (email) => {
        return userStore.findByEmail(email);
    },
    updateById: (id, updates) => {
        return userStore.updateById(id, updates);
    },
};

export default userStoreAdapter;
