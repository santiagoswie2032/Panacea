/**
 * Panacea — MongoDB User Store (Mongoose)
 * Persists users to MongoDB Atlas via Mongoose.
 */

import User from '../models/User.js';

const userStore = {
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

export default userStore;
