/**
 * Panacea — MongoDB User Store (Mongoose)
 * Persists users to MongoDB Atlas via Mongoose.
 */

const User = require('../models/User');

module.exports = {
    findByEmail: async (email) => {
        if (!email) return null;
        return await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    },
    findById: async (id) => {
        return await User.findById(id);
    },
    create: async (user) => {
        const newUser = new User(user);
        return await newUser.save();
    },
    updateById: async (id, updates) => {
        return await User.findByIdAndUpdate(id, updates, { new: true });
    },
};
