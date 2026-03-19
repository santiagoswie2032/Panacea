/**
 * BoxForm Component
 *
 * Modal form for creating or editing a Box.
 * Displays a simple input field for the box name.
 * Accessibility: Large inputs, clear labels, easy-to-tap buttons.
 */

import { useState, useEffect } from 'react';
import Icon from './Icon';
import './BoxForm.css';

export default function BoxForm({ box, onSave, onClose }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (box) {
            setName(box.name);
        } else {
            setName('');
        }
        setError('');
    }, [box]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Box name is required');
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
                        {box ? 'Edit Box' : 'Create New Box'}
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
                        <label htmlFor="box-name" className="form-label">
                            Box Name
                        </label>
                        <input
                            id="box-name"
                            type="text"
                            className={`form-input ${error ? 'form-input--error' : ''}`}
                            placeholder="e.g., Bathroom Cabinet, Nightstand Drawer"
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
                            {isSaving ? 'Saving...' : box ? 'Update Box' : 'Create Box'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
