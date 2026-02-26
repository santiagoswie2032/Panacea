const userStore = require('../config/userStore');

// Get profile
exports.getProfile = async (req, res) => {
    res.json({ success: true, data: req.user });
};

// Update profile
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedFields = [
            'name',
            'age',
            'phone',
            'bloodGroup',
            'emergencyContact',
            'emergencyContactName',
            'medicalConditions',
            'notificationsEnabled',
        ];

        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = userStore.updateById(req.userId, updates);

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Get emergency info
exports.getEmergencyInfo = async (req, res) => {
    const user = req.user;
    res.json({
        success: true,
        data: {
            userName: user.name,
            userAge: user.age,
            bloodGroup: user.bloodGroup,
            medicalConditions: user.medicalConditions,
            emergencyContact: user.emergencyContact,
            emergencyContactName: user.emergencyContactName,
        },
    });
};

// Update emergency info
exports.updateEmergencyInfo = async (req, res, next) => {
    try {
        const { emergencyContact, emergencyContactName, bloodGroup, medicalConditions } = req.body;

        const user = userStore.updateById(req.userId, {
            emergencyContact,
            emergencyContactName,
            bloodGroup,
            medicalConditions,
        });

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
