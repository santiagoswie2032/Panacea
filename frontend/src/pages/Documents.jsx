import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
<<<<<<< HEAD
import { FolderOpen, Bone, Brain, Heart, FileText, Microscope, File, Lock, Eye, Pencil, Trash2, X, UploadCloud } from 'lucide-react';
import './Documents.css';

const CATEGORIES = [
    { key: '', label: 'All', icon: <FolderOpen size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> },
    { key: 'xray', label: 'X-Rays', icon: <Bone size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> },
    { key: 'ctscan', label: 'CT Scans', icon: <Brain size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> },
    { key: 'mri', label: 'MRI', icon: <Heart size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> },
    { key: 'prescription', label: 'Prescriptions', icon: <FileText size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> },
    { key: 'labreport', label: 'Lab Reports', icon: <Microscope size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> },
=======
import Icon from '../components/Icon';
import './Documents.css';

const CATEGORIES = [
    { key: '', label: 'All', icon: 'folder' },
    { key: 'xray', label: 'X-Rays', icon: 'scan' },
    { key: 'ctscan', label: 'CT Scans', icon: 'scan' },
    { key: 'mri', label: 'MRI', icon: 'activity' },
    { key: 'prescription', label: 'Prescriptions', icon: 'fileText' },
    { key: 'labreport', label: 'Lab Reports', icon: 'flask' },
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
];

const DUMMY_DOCUMENTS = [
    {
        _id: 'dummy1',
        name: 'Chest X-Ray Report',
        category: 'xray',
        fileSize: 2048576,
        createdAt: new Date('2025-12-15'),
        isDummy: true,
    },
    {
        _id: 'dummy2',
        name: 'Blood Test Report',
        category: 'labreport',
        fileSize: 512000,
        createdAt: new Date('2025-12-10'),
        isDummy: true,
    },
    {
        _id: 'dummy3',
        name: 'Heart Medication Prescription',
        category: 'prescription',
        fileSize: 256000,
        createdAt: new Date('2025-12-05'),
        isDummy: true,
    },
    {
        _id: 'dummy4',
        name: 'Brain MRI Scan Results',
        category: 'mri',
        fileSize: 5242880,
        createdAt: new Date('2025-11-20'),
        isDummy: true,
    },
];

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default function Documents() {
    const toast = useToast();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({ name: '', category: 'prescription', file: null });
    const [uploading, setUploading] = useState(false);
    const [renamingDoc, setRenamingDoc] = useState(null);
    const [renameValue, setRenameValue] = useState('');

    const fetchDocuments = useCallback(async () => {
        try {
            const { data } = await api.getDocuments(activeCategory);
            // Use dummy data if no real documents exist
            if (data && data.length > 0) {
                setDocuments(data);
            } else {
                const filtered = activeCategory
                    ? DUMMY_DOCUMENTS.filter(doc => doc.category === activeCategory)
                    : DUMMY_DOCUMENTS;
                setDocuments(filtered);
            }
        } catch (error) {
            // Use dummy data on error
            const filtered = activeCategory
                ? DUMMY_DOCUMENTS.filter(doc => doc.category === activeCategory)
                : DUMMY_DOCUMENTS;
            setDocuments(filtered);
        } finally {
            setLoading(false);
        }
    }, [activeCategory]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadForm.file) {
            toast.error('Please select a file');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadForm.file);
            formData.append('name', uploadForm.name || uploadForm.file.name);
            formData.append('category', uploadForm.category);

            await api.uploadDocument(formData);
            toast.success('Document uploaded!');
            setShowUpload(false);
            setUploadForm({ name: '', category: 'prescription', file: null });
            await fetchDocuments();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRename = async (id) => {
        if (!renameValue.trim()) return;
        try {
            await api.renameDocument(id, renameValue);
            toast.success('Document renamed');
            setRenamingDoc(null);
            await fetchDocuments();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this document? This cannot be undone.')) return;
        try {
            await api.deleteDocument(id);
            toast.success('Document deleted');
            await fetchDocuments();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getCategoryIcon = (cat) => {
        const found = CATEGORIES.find((c) => c.key === cat);
<<<<<<< HEAD
        return found?.icon || <File size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} />;
=======
        return found?.icon || 'file';
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p className="text-muted">Loading documents...</p>
            </div>
        );
    }

    return (
        <div className="documents-page">
            <div className="section-header">
<<<<<<< HEAD
                <h1 className="heading-2"><File size={32} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Medical Documents</h1>
=======
                <h1 className="heading-2">
                    <Icon name="folder" size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                    Medical Documents
                </h1>
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                <button className="btn btn--primary btn--sm" onClick={() => setShowUpload(true)}>
                    <Icon name="plus" size={16} /> Upload
                </button>
            </div>

            <p className="docs-privacy-note">
<<<<<<< HEAD
                <Lock size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Your documents are stored securely and only accessible to you
=======
                <Icon name="lock" size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Your documents are stored securely and only accessible to you
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
            </p>

            {/* Category tabs */}
            <div className="tabs">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.key}
                        className={`tab ${activeCategory === cat.key ? 'tab--active' : ''}`}
                        onClick={() => { setActiveCategory(cat.key); setLoading(true); }}
                    >
                        <Icon name={cat.icon} size={14} style={{ marginRight: 4 }} /> {cat.label}
                    </button>
                ))}
            </div>

            {/* Document Grid */}
            {documents.length === 0 ? (
                <div className="empty-state">
<<<<<<< HEAD
                    <div className="empty-state__icon"><FolderOpen size={48} /></div>
=======
                    <div className="empty-state__icon">
                        <Icon name="folder" size={32} color="var(--color-text-muted)" />
                    </div>
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                    <p className="empty-state__title">No documents yet</p>
                    <p className="empty-state__text">Upload your medical documents to keep them organized and accessible</p>
                </div>
            ) : (
                <div className="docs-grid">
                    {documents.map((doc) => (
                        <div key={doc._id} className="doc-card glass-card">
                            <div className="doc-card__icon">
                                <Icon name={getCategoryIcon(doc.category)} size={24} color="var(--color-primary)" />
                            </div>
                            <div className="doc-card__info">
                                {renamingDoc === doc._id ? (
                                    <div className="doc-card__rename">
                                        <input
                                            className="form-input"
                                            value={renameValue}
                                            onChange={(e) => setRenameValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleRename(doc._id)}
                                            autoFocus
                                        />
                                        <button className="btn btn--primary btn--sm" onClick={() => handleRename(doc._id)}>
                                            Save
                                        </button>
                                        <button className="btn btn--ghost btn--sm" onClick={() => setRenamingDoc(null)}>
<<<<<<< HEAD
                                            <X size={16} />
=======
                                            <Icon name="x" size={14} />
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                                        </button>
                                    </div>
                                ) : (
                                    <h3 className="doc-card__name">{doc.name}</h3>
                                )}
                                <div className="doc-card__meta">
                                    <span>{formatFileSize(doc.fileSize)}</span>
                                    <span>•</span>
                                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="doc-card__actions">
                                <a
                                    href={api.getDocumentUrl(doc._id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="doc-card__btn"
                                    title="Preview"
                                >
<<<<<<< HEAD
                                    <Eye size={16} />
=======
                                    <Icon name="eye" size={16} />
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                                </a>
                                <button
                                    className="doc-card__btn"
                                    onClick={() => { setRenamingDoc(doc._id); setRenameValue(doc.name); }}
                                    title="Rename"
                                >
<<<<<<< HEAD
                                    <Pencil size={16} />
=======
                                    <Icon name="edit" size={16} />
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                                </button>
                                <button
                                    className="doc-card__btn doc-card__btn--delete"
                                    onClick={() => handleDelete(doc._id)}
                                    title="Delete"
                                >
<<<<<<< HEAD
                                    <Trash2 size={16} />
=======
                                    <Icon name="trash" size={16} />
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUpload && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowUpload(false)}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="heading-3">Upload Document</h2>
<<<<<<< HEAD
                            <button className="modal-close" onClick={() => setShowUpload(false)}><X size={24} /></button>
=======
                            <button className="modal-close" onClick={() => setShowUpload(false)}>
                                <Icon name="x" size={18} />
                            </button>
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                        </div>

                        <form onSubmit={handleUpload}>
                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-input form-select"
                                    value={uploadForm.category}
                                    onChange={(e) => setUploadForm((prev) => ({ ...prev, category: e.target.value }))}
                                >
                                    {CATEGORIES.filter((c) => c.key).map((cat) => (
                                        <option key={cat.key} value={cat.key}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Document Name</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="e.g., Blood Test Results - Feb 2024"
                                    value={uploadForm.name}
                                    onChange={(e) => setUploadForm((prev) => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">File</label>
                                <div className="doc-upload-zone">
                                    <input
                                        type="file"
                                        id="doc-file"
                                        className="doc-upload-zone__input"
                                        accept="image/*,application/pdf"
                                        onChange={(e) =>
                                            setUploadForm((prev) => ({
                                                ...prev,
                                                file: e.target.files[0],
                                                name: prev.name || e.target.files[0]?.name || '',
                                            }))
                                        }
                                    />
                                    <label htmlFor="doc-file" className="doc-upload-zone__label">
                                        {uploadForm.file ? (
                                            <>
<<<<<<< HEAD
                                                <File size={16} />
=======
                                                <Icon name="file" size={20} color="var(--color-primary)" />
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                                                <span>{uploadForm.file.name}</span>
                                                <span className="text-small text-muted">{formatFileSize(uploadForm.file.size)}</span>
                                            </>
                                        ) : (
                                            <>
<<<<<<< HEAD
                                                <span className="doc-upload-zone__icon"><UploadCloud size={24} /></span>
=======
                                                <span className="doc-upload-zone__icon">
                                                    <Icon name="upload" size={28} color="var(--color-primary)" />
                                                </span>
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                                                <span>Tap to select a file</span>
                                                <span className="text-small text-muted">PDF, JPEG, PNG • Max 10MB</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button type="button" className="btn btn--ghost w-full" onClick={() => setShowUpload(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn--primary w-full" disabled={uploading}>
                                    {uploading ? <span className="spinner spinner--sm" /> : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
