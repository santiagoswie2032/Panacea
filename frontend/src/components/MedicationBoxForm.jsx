/**
 * MedicationBoxForm Component
 *
 * Modal form for adding or editing a medication within a Box.
 * Simplified form (just name) compared to the full Medication form.
 * Used in the Boxes tab to track what medications are stored in each physical box.
 */

import { useState, useEffect } from 'react';
import Icon from './Icon';
import './MedicationBoxForm.css';

export default function MedicationBoxForm({ medication, onSave, onClose }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (medication) {
            setName(medication.name);
        } else {
            setName('');
        }
        setError('');
    }, [medication]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Medication name is required');
            return;
        }

        setIsSaving(true);
        try {
            await onSave({ name: name.trim() });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">
                        {medication ? 'Edit Item' : 'Add Medication'}
                    </h2>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        <Icon name="x" size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="med-name" className="form-label">
                            Medication Name
                        </label>
                        <input
                            id="med-name"
                            type="text"
                            className={`form-input ${error ? 'form-input--error' : ''}`}
                            placeholder="e.g., Aspirin, Vitamin D"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            disabled={isSaving}
                            maxLength={100}
                            autoFocus
                        />
                        {error && <p className="form-error">{error}</p>}
                        <p className="form-hint">
                            Enter the name of the medication stored in this box
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn--secondary btn--lg"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary btn--lg"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : medication ? 'Update' : 'Add to Box'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
