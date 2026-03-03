/**
 * Panacea — Medication Controller (JSON file-based)
 */

import medicationStore from '../config/medicationStore.js';
import doseRecordStore from '../config/doseRecordStore.js';
import { v4 as uuidv4 } from 'uuid';

// Get all medications for user
export const getAll = async (req, res, next) => {
    try {
        const medications = medicationStore.find({ userId: req.userId }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, data: medications });
    } catch (error) {
        next(error);
    }
};

// Get single medication
export const getOne = async (req, res, next) => {
    try {
        const medication = medicationStore.findOne({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: 'Medication not found',
            });
        }

        res.json({ success: true, data: medication });
    } catch (error) {
        next(error);
    }
};

// Create medication
export const create = async (req, res, next) => {
    try {
        const { name, dosage, timings, totalStock, instructions } = req.body;

        if (!name || !dosage || !timings || timings.length === 0 || totalStock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name, dosage, timings, and totalStock are required.',
            });
        }

        const medication = medicationStore.create({
            userId: req.userId,
            name,
            dosage,
            timings,
            totalStock,
            remainingStock: totalStock,
            instructions: instructions || '',
            active: true,
        });

        res.status(201).json({ success: true, data: medication });
    } catch (error) {
        next(error);
    }
};

// Update medication
export const update = async (req, res, next) => {
    try {
        const { name, dosage, timings, totalStock, remainingStock, instructions, active } = req.body;

        const medication = medicationStore.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { name, dosage, timings, totalStock, remainingStock, instructions, active }
        );

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: 'Medication not found',
            });
        }

        res.json({ success: true, data: medication });
    } catch (error) {
        next(error);
    }
};

// Delete medication
export const remove = async (req, res, next) => {
    try {
        const medication = medicationStore.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: 'Medication not found',
            });
        }

        // Delete associated dose records
        doseRecordStore.deleteByMedicationId(req.params.id);

        res.json({ success: true, message: 'Medication deleted' });
    } catch (error) {
        next(error);
    }
};

// Mark a dose as taken
export const takeDose = async (req, res, next) => {
    try {
        const { medicationId, scheduledTime, date } = req.body;

        if (!medicationId || !scheduledTime || !date) {
            return res.status(400).json({
                success: false,
                message: 'medicationId, scheduledTime, and date are required.',
            });
        }

        // Find or create dose record
        let doseRecord = doseRecordStore.findOne({
            medicationId,
            userId: req.userId,
            scheduledTime,
            date,
        });

        if (!doseRecord) {
            doseRecord = doseRecordStore.create({
                medicationId,
                userId: req.userId,
                scheduledTime,
                date,
                status: 'taken',
                takenAt: new Date().toISOString(),
            });
        } else {
            doseRecord = doseRecordStore.updateById(doseRecord._id, {
                status: 'taken',
                takenAt: new Date().toISOString(),
            });
        }

        // Decrease remaining stock
        const medication = medicationStore.findOne({ _id: medicationId });
        if (medication) {
            medicationStore.findByIdAndUpdate(medicationId, {
                remainingStock: Math.max(0, medication.remainingStock - 1),
            });
        }

        res.json({ success: true, data: doseRecord });
    } catch (error) {
        next(error);
    }
};

// Get today's schedule
export const getTodaySchedule = async (req, res, next) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Get all active medications for user
        const medications = medicationStore.find({ userId: req.userId }).filter((m) => m.active);

        // Get existing dose records for today
        const existingRecords = doseRecordStore.findByDate(today, req.userId);

        const schedule = [];

        for (const med of medications) {
            for (const time of med.timings) {
                // Check if dose record exists
                const existing = existingRecords.find(
                    (r) => r.medicationId === med._id && r.scheduledTime === time
                );

                if (existing) {
                    schedule.push({
                        ...existing,
                        medication: med,
                    });
                } else {
                    // Auto-create dose record
                    const status = time < currentTime ? 'missed' : 'upcoming';
                    const record = doseRecordStore.create({
                        userId: req.userId,
                        medicationId: med._id,
                        scheduledTime: time,
                        date: today,
                        status,
                    });
                    schedule.push({
                        ...record,
                        medication: med,
                    });
                }
            }
        }

        // Sort by scheduled time
        schedule.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

        res.json({ success: true, data: schedule });
    } catch (error) {
        next(error);
    }
};
