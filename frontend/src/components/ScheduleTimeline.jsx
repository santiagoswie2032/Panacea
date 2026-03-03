<<<<<<< HEAD
import { CheckCircle, XCircle, Bell, SkipForward, ClipboardList, Check } from 'lucide-react';
=======
import Icon from './Icon';
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
import './ScheduleTimeline.css';

function formatTime12(time24) {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

const STATUS_CONFIG = {
<<<<<<< HEAD
    taken: { icon: <CheckCircle size={16} />, label: 'Taken', className: 'taken' },
    missed: { icon: <XCircle size={16} />, label: 'Missed', className: 'missed' },
    upcoming: { icon: <Bell size={16} />, label: 'Upcoming', className: 'upcoming' },
    skipped: { icon: <SkipForward size={16} />, label: 'Skipped', className: 'missed' },
=======
    taken: { icon: 'checkCircle', label: 'Taken', className: 'taken' },
    missed: { icon: 'xCircle', label: 'Missed', className: 'missed' },
    upcoming: { icon: 'clock', label: 'Upcoming', className: 'upcoming' },
    skipped: { icon: 'minus', label: 'Skipped', className: 'missed' },
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
};

export default function ScheduleTimeline({ schedule, onTakeDose, loading }) {
    if (!schedule || schedule.length === 0) {
        return (
            <div className="empty-state">
<<<<<<< HEAD
                <div className="empty-state__icon"><ClipboardList size={48} /></div>
=======
                <div className="empty-state__icon">
                    <Icon name="calendar" size={32} color="var(--color-text-muted)" />
                </div>
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                <p className="empty-state__title">No medications scheduled</p>
                <p className="empty-state__text">Add medications to see your daily schedule here</p>
            </div>
        );
    }

    return (
        <div className="timeline">
            {schedule.map((dose, index) => {
                const config = STATUS_CONFIG[dose.status] || STATUS_CONFIG.upcoming;
                const med = dose.medication;

                return (
                    <div key={`${dose.medicationId}-${dose.scheduledTime}-${index}`} className="timeline__item">
                        <div className="timeline__line">
                            <div className={`timeline__dot timeline__dot--${config.className}`}>
<<<<<<< HEAD
                                <span>{config.icon}</span>
=======
                                <Icon name={config.icon} size={16} />
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                            </div>
                            {index < schedule.length - 1 && <div className="timeline__connector" />}
                        </div>

                        <div className={`timeline__content glass-card timeline__content--${config.className}`}>
                            <div className="timeline__header">
                                <div>
                                    <h4 className="timeline__med-name">{med?.name || 'Unknown'}</h4>
                                    <p className="timeline__med-dosage">{med?.dosage}</p>
                                </div>
                                <div className="timeline__time">
                                    {formatTime12(dose.scheduledTime)}
                                </div>
                            </div>

                            <div className="timeline__footer">
                                <span className={`badge badge--${config.className}`}>
                                    {config.label}
                                </span>

                                {dose.status === 'upcoming' && (
                                    <button
                                        className="btn btn--success btn--sm"
                                        onClick={() => onTakeDose(dose)}
                                        disabled={loading}
                                    >
<<<<<<< HEAD
                                        {loading ? <span className="spinner spinner--sm" /> : <><Check size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Take Now</>}
=======
                                        {loading ? <span className="spinner spinner--sm" /> : (
                                            <><Icon name="check" size={14} /> Take Now</>
                                        )}
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                                    </button>
                                )}

                                {dose.status === 'missed' && (
                                    <button
                                        className="btn btn--ghost btn--sm"
                                        onClick={() => onTakeDose(dose)}
                                        disabled={loading}
                                    >
                                        Mark Taken
                                    </button>
                                )}
                            </div>

                            {med?.instructions && (
                                <p className="timeline__instructions">{med.instructions}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div >
    );
}
