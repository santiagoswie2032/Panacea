/**
 * Box Controller — Handle all box and medication operations
 */

const mongoose = require('mongoose');
const Box = require('../models/Box');

/**
 * GET /api/boxes
 * Get all boxes for the authenticated user
 */
exports.getBoxes = async (req, res) => {
    try {
        const boxes = await Box.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        
        // Normalize response: convert _id to id for medications
        const normalizedBoxes = boxes.map(box => ({
            ...box.toObject(),
            id: box._id.toString(),
            medications: box.medications.map(med => ({
                id: med._id.toString(),
                name: med.name
            }))
        }));
        
        res.status(200).json(normalizedBoxes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/boxes/:id
 * Get a single box by ID
 */
exports.getBox = async (req, res) => {
    try {
        const box = await Box.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        const normalized = {
            ...box.toObject(),
            id: box._id.toString(),
            medications: box.medications.map(med => ({
                id: med._id.toString(),
                name: med.name
            }))
        };

        res.status(200).json(normalized);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/boxes
 * Create a new box
 */
exports.createBox = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Box name is required' });
        }

        const box = new Box({
            userId: req.user.id,
            name: name.trim(),
            medications: []
        });

        await box.save();
        
        const normalized = {
            ...box.toObject(),
            id: box._id.toString(),
            medications: []
        };

        res.status(201).json(normalized);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * PUT /api/boxes/:id
 * Update a box (e.g., rename it)
 */
exports.updateBox = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Box name is required' });
        }

        const box = await Box.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        box.name = name.trim();
        await box.save();

        const normalized = {
            ...box.toObject(),
            id: box._id.toString(),
            medications: box.medications.map(med => ({
                id: med._id.toString(),
                name: med.name
            }))
        };

        res.status(200).json(normalized);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * DELETE /api/boxes/:id
 * Delete a box and all its medications
 */
exports.deleteBox = async (req, res) => {
    try {
        const box = await Box.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        res.status(200).json({ message: 'Box deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/boxes/:boxId/medications
 * Add a medication to a specific box
 */
exports.addMedicationToBox = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Medication name is required' });
        }

        const box = await Box.findOne({
            _id: req.params.boxId,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        // Create new medication object with unique ID
        const newMedication = {
            _id: new mongoose.Types.ObjectId(),
            name: name.trim()
        };

        box.medications.push(newMedication);
        await box.save();

        // Return normalized response
        res.status(201).json({
            id: newMedication._id.toString(),
            name: newMedication.name
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * PUT /api/boxes/:boxId/medications/:medId
 * Update a medication within a box
 */
exports.updateBoxMedication = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Medication name is required' });
        }

        const box = await Box.findOne({
            _id: req.params.boxId,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        // Find medication in the box by _id
        const medication = box.medications.find(m => m._id.toString() === req.params.medId);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found in box' });
        }

        medication.name = name.trim();
        await box.save();

        // Return normalized response
        res.status(200).json({
            id: medication._id.toString(),
            name: medication.name
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * DELETE /api/boxes/:boxId/medications/:medId
 * Delete a medication from a box
 */
exports.deleteBoxMedication = async (req, res) => {
    try {
        const box = await Box.findOne({
            _id: req.params.boxId,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        // Remove medication from the box by filtering
        const medIndex = box.medications.findIndex(m => m._id.toString() === req.params.medId);

        if (medIndex === -1) {
            return res.status(404).json({ message: 'Medication not found in box' });
        }

        box.medications.splice(medIndex, 1);
        await box.save();

        res.status(200).json({ message: 'Medication removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
