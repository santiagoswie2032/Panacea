/**
 * Box Model — Digitized medication storage tracking
 * 
 * Represents physical boxes where users store medications.
 * Each box contains a list of medications stored in that box.
 */

const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: [true, 'Box name is required'],
            trim: true,
            maxlength: [100, 'Box name cannot exceed 100 characters']
        },
        medications: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: () => new mongoose.Types.ObjectId()
                },
                name: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [100, 'Medication name cannot exceed 100 characters']
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Box', boxSchema);
