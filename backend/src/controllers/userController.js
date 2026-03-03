import userStore from '../config/userStore.js';

// Get profile
export const getProfile = async (req, res) => {
    res.json({ success: true, data: req.user });
};

// Update profile
export const updateProfile = async (req, res, next) => {
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

        const user = await userStore.updateById(req.userId, updates);

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Get emergency info
export const getEmergencyInfo = async (req, res) => {
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
export const updateEmergencyInfo = async (req, res, next) => {
    try {
        const { emergencyContact, emergencyContactName, bloodGroup, medicalConditions } = req.body;

        const user = await userStore.updateById(req.userId, {
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
