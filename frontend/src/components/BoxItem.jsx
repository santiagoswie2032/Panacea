/**
 * BoxItem Component
 *
 * Represents a single "Box" in the tree view.
 * Features:
 * - Expandable/collapsible to show/hide medications
 * - Action buttons: Edit, Delete
 * - Add medication button
 * - Shows medication list when expanded
 *
 * Accessibility: Large touch targets (48px), clear labels, smooth transitions
 */

import { useState } from 'react';
import Icon from './Icon';
import './BoxItem.css';

export default function BoxItem({
    box,
    onEdit,
    onDelete,
    onAddMedication,
    onEditMedication,
    onDeleteMedication,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const medicationCount = box.medications?.length || 0;

    return (
        <div className="box-item">
            {/* Box header — clickable to toggle expand */}
            <div className="box-item__header">
                <button
                    className="box-item__expand-btn"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} box: ${box.name}`}
                >
                    <Icon
                        name={isExpanded ? 'chevronDown' : 'chevronRight'}
                        size={24}
                    />
                </button>

                <div className="box-item__title-area">
                    <Icon name="folder" size={24} className="box-item__icon" />
                    <div className="box-item__text">
                        <h3 className="box-item__name">{box.name}</h3>
                        <span className="box-item__count">
                            {medicationCount} {medicationCount === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="box-item__actions">
                    <button
                        className="box-item__action-btn"
                        onClick={onEdit}
                        aria-label={`Edit box: ${box.name}`}
                        title="Edit box name"
                    >
                        <Icon name="edit" size={18} />
                    </button>
                    <button
                        className="box-item__action-btn box-item__action-btn--delete"
                        onClick={onDelete}
                        aria-label={`Delete box: ${box.name}`}
                        title="Delete box"
                    >
                        <Icon name="trash" size={18} />
                    </button>
                </div>
            </div>

            {/* Expandable content — medications list */}
            {isExpanded && (
                <div className="box-item__content">
                    {medicationCount === 0 ? (
                        <div className="box-item__empty">
                            <p className="text-muted">No medications in this box yet</p>
                            <button
                                className="btn btn--secondary btn--sm"
                                onClick={onAddMedication}
                            >
                                <Icon name="plus" size={14} /> Add Item
                            </button>
                        </div>
                    ) : (
                        <div className="medications-list">
                            {box.medications.map((med) => (
                                <MedicationListItem
                                    key={med.id}
                                    medication={med}
                                    onEdit={() => onEditMedication(med)}
                                    onDelete={() => onDeleteMedication(med.id)}
                                />
                            ))}

                            {/* Add another medication button */}
                            <button
                                className="btn btn--secondary btn--sm btn--block"
                                onClick={onAddMedication}
                                style={{ marginTop: 'var(--space-4)' }}
                            >
                                <Icon name="plus" size={14} /> Add Another Item
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * MedicationListItem Component
 *
 * Displays a single medication within a box.
 * Shows medication name and action buttons.
 */
function MedicationListItem({ medication, onEdit, onDelete }) {
    return (
        <div className="med-list-item">
            <div className="med-list-item__content">
                <Icon name="pill" size={18} className="med-list-item__icon" />
                <span className="med-list-item__name">{medication.name}</span>
            </div>
            <div className="med-list-item__actions">
                <button
                    className="med-list-item__action-btn"
                    onClick={onEdit}
                    aria-label={`Edit: ${medication.name}`}
                    title="Edit medication"
                >
                    <Icon name="edit" size={16} />
                </button>
                <button
                    className="med-list-item__action-btn med-list-item__action-btn--delete"
                    onClick={onDelete}
                    aria-label={`Remove: ${medication.name}`}
                    title="Remove medication"
                >
                    <Icon name="trash" size={16} />
                </button>
            </div>
        </div>
    );
}
