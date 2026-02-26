import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Ambulance, ShieldAlert, Siren, Skull, LifeBuoy, Brain, User as UserIcon, Phone, ChevronRight, AlertTriangle, Mail } from 'lucide-react';
import './Emergency.css';

// Emergency hotline numbers
const EMERGENCY_NUMBERS = [
    { id: 1, name: 'Ambulance', number: '102', icon: <Ambulance size={24} />, color: 'primary' },
    { id: 2, name: 'Police', number: '100', icon: <ShieldAlert size={24} />, color: 'danger' },
    { id: 3, name: 'Emergency Services', number: '112', icon: <Siren size={24} />, color: 'warning' },
    { id: 4, name: 'Poison Control', number: '1800-11-2131', icon: <Skull size={24} />, color: 'danger' },
    { id: 5, name: 'Disaster Management', number: '108', icon: <LifeBuoy size={24} />, color: 'warning' },
    { id: 6, name: 'Mental Health Helpline', number: '9152987821', icon: <Brain size={24} />, color: 'info' },
];

// Dummy family members
const DUMMY_FAMILY_MEMBERS = [
    {
        id: 1,
        name: 'Sarah Johnson',
        relationship: 'Spouse',
        phone: '+91-9876543210',
        email: 'sarah.j@email.com',
        icon: <UserIcon size={32} />,
        isPrimary: true,
    },
    {
        id: 2,
        name: 'Michael Johnson',
        relationship: 'Son',
        phone: '+91-9876543211',
        email: 'michael.j@email.com',
        icon: <UserIcon size={32} />,
        isPrimary: false,
    },
    {
        id: 3,
        name: 'Emily Johnson',
        relationship: 'Daughter',
        phone: '+91-9876543212',
        email: 'emily.j@email.com',
        icon: <UserIcon size={32} />,
        isPrimary: false,
    },
    {
        id: 4,
        name: 'Robert Johnson',
        relationship: 'Brother',
        phone: '+91-9876543213',
        email: 'robert.j@email.com',
        icon: <UserIcon size={32} />,
        isPrimary: false,
    },
];

export default function Emergency() {
    const { user } = useAuth();
    const [emergencyInfo, setEmergencyInfo] = useState(null);
    const [familyMembers, setFamilyMembers] = useState(DUMMY_FAMILY_MEMBERS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmergency = async () => {
            try {
                const { data } = await api.getEmergencyInfo();
                setEmergencyInfo(data);
            } catch {
                // Fallback to local user data
                setEmergencyInfo({
                    userName: user?.name,
                    userAge: user?.age,
                    bloodGroup: user?.bloodGroup,
                    medicalConditions: user?.medicalConditions || [],
                    emergencyContact: user?.emergencyContact,
                    emergencyContactName: user?.emergencyContactName,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchEmergency();
    }, [user]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
            </div>
        );
    }

    const hasContact = emergencyInfo?.emergencyContact;

    return (
        <div className="emergency-page">
            {/* Emergency header */}
            <div className="emergency-header">
                <div className="emergency-header__pulse" />
                <div className="emergency-header__icon"><LifeBuoy size={48} /></div>
                <h1 className="emergency-header__title">Emergency</h1>
                <p className="emergency-header__subtitle">Quick access to emergency services</p>
            </div>

            {/* Primary Contact Button */}
            {hasContact ? (
                <a
                    href={`tel:${emergencyInfo.emergencyContact}`}
                    className="emergency-primary-btn"
                    aria-label={`Call ${emergencyInfo.emergencyContactName || 'emergency contact'}`}
                >
                    <span className="emergency-primary-btn__icon"><Phone size={24} /></span>
                    <div className="emergency-primary-btn__content">
                        <span className="emergency-primary-btn__label">Primary Contact</span>
                        <span className="emergency-primary-btn__name">
                            {emergencyInfo.emergencyContactName || 'Emergency Contact'}
                        </span>
                        <span className="emergency-primary-btn__number">
                            {emergencyInfo.emergencyContact}
                        </span>
                    </div>
                    <span className="emergency-primary-btn__arrow"><ChevronRight size={24} /></span>
                </a>
            ) : (
                <div className="emergency-no-contact glass-card">
                    <p className="emergency-no-contact__text">
                        <AlertTriangle size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> No emergency contact set up
                    </p>
                    <p className="text-small text-muted">
                        Go to Profile → Settings to add an emergency contact
                    </p>
                </div>
            )}

            {/* Emergency Hotlines */}
            <section className="emergency-section">
                <h2 className="emergency-section__title"><Phone size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Emergency Hotlines</h2>
                <div className="emergency-grid">
                    {EMERGENCY_NUMBERS.map((service) => (
                        <a
                            key={service.id}
                            href={`tel:${service.number}`}
                            className={`emergency-card glass-card emergency-card--${service.color}`}
                        >
                            <div className="emergency-card__icon">{service.icon}</div>
                            <div className="emergency-card__content">
                                <h3 className="emergency-card__name">{service.name}</h3>
                                <p className="emergency-card__number">{service.number}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            {/* Family Members */}
            <section className="emergency-section">
                <h2 className="emergency-section__title"><UserIcon size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Family Members</h2>
                <div className="family-grid">
                    {familyMembers.map((member) => (
                        <div
                            key={member.id}
                            className={`family-card glass-card ${member.isPrimary ? 'family-card--primary' : ''}`}
                        >
                            <div className="family-card__header">
                                <div className="family-card__avatar">{member.icon}</div>
                                {member.isPrimary && (
                                    <span className="family-card__badge">Primary</span>
                                )}
                            </div>
                            <h3 className="family-card__name">{member.name}</h3>
                            <p className="family-card__relation">{member.relationship}</p>
                            <div className="family-card__actions">
                                <a
                                    href={`tel:${member.phone}`}
                                    className="family-card__btn family-card__btn--call"
                                    title="Call"
                                >
                                    <Phone size={16} />
                                </a>
                                <a
                                    href={`mailto:${member.email}`}
                                    className="family-card__btn family-card__btn--email"
                                    title="Email"
                                >
                                    <Mail size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* User medical info */}
            <section className="emergency-section">
                <h2 className="emergency-section__title"><UserIcon size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Patient Information</h2>

                <div className="emergency-info__grid">
                    <div className="emergency-info__card glass-card">
                        <span className="emergency-info__label">Name</span>
                        <span className="emergency-info__value">
                            {emergencyInfo?.userName || 'Not set'}
                        </span>
                    </div>

                    <div className="emergency-info__card glass-card">
                        <span className="emergency-info__label">Age</span>
                        <span className="emergency-info__value emergency-info__value--large">
                            {emergencyInfo?.userAge || '—'}
                        </span>
                    </div>

                    <div className="emergency-info__card glass-card emergency-info__card--blood">
                        <span className="emergency-info__label">Blood Group</span>
                        <span className="emergency-info__value emergency-info__value--blood">
                            {emergencyInfo?.bloodGroup || 'Not set'}
                        </span>
                    </div>

                    <div className="emergency-info__card glass-card">
                        <span className="emergency-info__label">Emergency Contact</span>
                        <span className="emergency-info__value">
                            {emergencyInfo?.emergencyContactName || 'Not set'}
                        </span>
                    </div>
                </div>

                {/* Medical conditions */}
                {emergencyInfo?.medicalConditions?.length > 0 && (
                    <div className="emergency-conditions glass-card">
                        <h3 className="emergency-conditions__title">Known Medical Conditions</h3>
                        <div className="emergency-conditions__list">
                            {emergencyInfo.medicalConditions.map((condition, index) => (
                                <span key={index} className="emergency-conditions__tag">
                                    {condition}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
