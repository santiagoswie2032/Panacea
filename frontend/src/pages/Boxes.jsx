/**
 * Boxes Page — Digitized medication storage tracking
 *
 * This page displays a tree-like view of physical medication boxes and their contents.
 * Older adults can create boxes, add medications to them, and track what's inside.
 *
 * Architecture:
 * - State management via useBoxes custom hook
 * - Box components that expand/collapse to reveal medications
 * - Form modals for creating/editing boxes and medications
 */

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import Icon from '../components/Icon';
import BoxItem from '../components/BoxItem';
import BoxForm from '../components/BoxForm';
import MedicationBoxForm from '../components/MedicationBoxForm';
import './Boxes.css';

export default function Boxes() {
    const toast = useToast();
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showBoxForm, setShowBoxForm] = useState(false);
    const [editingBox, setEditingBox] = useState(null);
    const [showMedicationForm, setShowMedicationForm] = useState(false);
    const [selectedBoxForMed, setSelectedBoxForMed] = useState(null);
    const [editingMedication, setEditingMedication] = useState(null);

    // Fetch all boxes
    const fetchBoxes = useCallback(async () => {
        try {
            const data = await api.getBoxes();
            setBoxes(data);
        } catch (error) {
            toast.error('Failed to load boxes');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchBoxes();
    }, [fetchBoxes]);

    // ============ BOX HANDLERS ============

    const handleCreateBox = async (boxData) => {
        try {
            await api.createBox(boxData);
            toast.success('Box created!');
            setShowBoxForm(false);
            await fetchBoxes();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEditBox = async (boxData) => {
        try {
            await api.updateBox(editingBox.id, boxData);
            toast.success('Box updated!');
            setEditingBox(null);
            await fetchBoxes();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteBox = async (boxId) => {
        if (!confirm('Are you sure you want to delete this box and all its contents? This action cannot be undone.')) {
            return;
        }
        try {
            await api.deleteBox(boxId);
            toast.success('Box deleted');
            await fetchBoxes();
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ============ MEDICATION HANDLERS ============

    const handleAddMedicationToBox = (boxId) => {
        setSelectedBoxForMed(boxId);
        setEditingMedication(null);
        setShowMedicationForm(true);
    };

    const handleSaveMedication = async (medicationData) => {
        try {
            if (editingMedication) {
                // Editing existing medication
                await api.updateBoxMedication(
                    selectedBoxForMed,
                    editingMedication.id,
                    medicationData
                );
                toast.success('Medication updated!');
            } else {
                // Creating new medication in box
                await api.addMedicationToBox(selectedBoxForMed, medicationData);
                toast.success('Medication added to box!');
            }
            setShowMedicationForm(false);
            setSelectedBoxForMed(null);
            setEditingMedication(null);
            await fetchBoxes();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEditMedication = (boxId, medication) => {
        setSelectedBoxForMed(boxId);
        setEditingMedication(medication);
        setShowMedicationForm(true);
    };

    const handleDeleteMedication = async (boxId, medicationId) => {
        if (!confirm('Are you sure you want to remove this medication from the box?')) {
            return;
        }
        try {
            await api.deleteBoxMedication(boxId, medicationId);
            toast.success('Medication removed');
            await fetchBoxes();
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p className="text-muted">Loading your boxes...</p>
            </div>
        );
    }

    return (
        <div className="boxes-page">
            {/* Page Header */}
            <div className="section-header">
                <h1 className="heading-2">Medication Boxes</h1>
                <button
                    className="btn btn--primary btn--lg"
                    onClick={() => {
                        setEditingBox(null);
                        setShowBoxForm(true);
                    }}
                    aria-label="Create a new medication box"
                >
                    <Icon name="plus" size={18} /> New Box
                </button>
            </div>

            {/* Empty state */}
            {boxes.length === 0 ? (
                <div className="empty-state">
                    <Icon name="inbox" size={48} className="empty-state__icon" />
                    <h2 className="empty-state__title">No boxes yet</h2>
                    <p className="empty-state__description">
                        Create a box to organize your medications by physical storage location
                    </p>
                    <button
                        className="btn btn--primary btn--lg"
                        onClick={() => {
                            setEditingBox(null);
                            setShowBoxForm(true);
                        }}
                    >
                        <Icon name="plus" size={18} /> Create Your First Box
                    </button>
                </div>
            ) : (
                /* Boxes list — tree view */
                <div className="boxes-container">
                    {boxes.map((box) => (
                        <BoxItem
                            key={box.id}
                            box={box}
                            onEdit={() => {
                                setEditingBox(box);
                                setShowBoxForm(true);
                            }}
                            onDelete={() => handleDeleteBox(box.id)}
                            onAddMedication={() => handleAddMedicationToBox(box.id)}
                            onEditMedication={(medication) => handleEditMedication(box.id, medication)}
                            onDeleteMedication={(medId) => handleDeleteMedication(box.id, medId)}
                        />
                    ))}
                </div>
            )}

            {/* Box Form Modal */}
            {showBoxForm && (
                <BoxForm
                    box={editingBox}
                    onSave={editingBox ? handleEditBox : handleCreateBox}
                    onClose={() => {
                        setShowBoxForm(false);
                        setEditingBox(null);
                    }}
                />
            )}

            {/* Medication Form Modal */}
            {showMedicationForm && (
                <MedicationBoxForm
                    medication={editingMedication}
                    onSave={handleSaveMedication}
                    onClose={() => {
                        setShowMedicationForm(false);
                        setSelectedBoxForMed(null);
                        setEditingMedication(null);
                    }}
                />
            )}
        </div>
    );
}
