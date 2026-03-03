<<<<<<< HEAD
import { Pencil, Trash2, Clock, Clipboard, AlertTriangle } from 'lucide-react';
=======
import Icon from './Icon';
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
import './MedicationCard.css';

function formatTime12(time24) {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

export default function MedicationCard({ medication, onEdit, onDelete }) {
    const { name, dosage, timings, remainingStock, totalStock, instructions, active } = medication;
    const stockPercent = totalStock > 0 ? Math.round((remainingStock / totalStock) * 100) : 0;
    const isLow = stockPercent <= 20;
    const isMedium = stockPercent > 20 && stockPercent <= 50;

    return (
        <div className={`med-card glass-card ${!active ? 'med-card--inactive' : ''}`}>
            <div className="med-card__header">
                <div className="med-card__info">
                    <h3 className="med-card__name">{name}</h3>
                    <p className="med-card__dosage">{dosage}</p>
                </div>
                <div className="med-card__actions">
                    <button
                        className="med-card__action-btn"
                        onClick={() => onEdit(medication)}
                        aria-label="Edit medication"
                    >
<<<<<<< HEAD
                        <Pencil size={16} />
=======
                        <Icon name="edit" size={16} />
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                    </button>
                    <button
                        className="med-card__action-btn med-card__action-btn--delete"
                        onClick={() => onDelete(medication._id)}
                        aria-label="Delete medication"
                    >
<<<<<<< HEAD
                        <Trash2 size={16} />
=======
                        <Icon name="trash" size={16} />
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                    </button>
                </div>
            </div>

            <div className="med-card__timings">
                {timings.map((time) => (
                    <span key={time} className="med-card__time-chip">
<<<<<<< HEAD
                        <Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {formatTime12(time)}
=======
                        <Icon name="clock" size={12} /> {formatTime12(time)}
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                    </span>
                ))}
            </div>

            {instructions && (
<<<<<<< HEAD
                <p className="med-card__instructions"><Clipboard size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {instructions}</p>
=======
                <p className="med-card__instructions">
                    <Icon name="clipboard" size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    {instructions}
                </p>
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
            )}

            <div className="med-card__stock">
                <div className="med-card__stock-info">
                    <span className="text-small text-muted">Stock</span>
                    <span className={`text-small ${isLow ? 'med-card__stock-low' : ''}`}>
                        {remainingStock} / {totalStock}
                    </span>
                </div>
                <div className="stock-bar">
                    <div
                        className={`stock-bar__fill ${isLow ? 'stock-bar__fill--low' : isMedium ? 'stock-bar__fill--medium' : 'stock-bar__fill--high'
                            }`}
                        style={{ width: `${stockPercent}%` }}
                    />
                </div>
                {isLow && (
                    <div className="badge badge--warning mt-2">
<<<<<<< HEAD
                        <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Low stock — refill soon
=======
                        <Icon name="alertTriangle" size={12} /> Low stock — refill soon
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                    </div>
                )}
            </div>
        </div>
    );
}
