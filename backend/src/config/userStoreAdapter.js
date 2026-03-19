/**
 * Panacea — JSON File-based User Store
 * Already handled by userStore.js but this is for the controller
 */

const userStore = require('./userStore');

module.exports = {
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
