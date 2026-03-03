import { useState } from 'react';
<<<<<<< HEAD
import { Activity, Microscope, HeartPulse, Brain } from 'lucide-react';
=======
import Icon from '../components/Icon';
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
import './Doctors.css';

const DOCTORS = [
    {
        _id: 'doc1',
        name: 'Dr. Rajesh Kumar',
        specialization: 'Radiologist',
        clinic: 'Apollo Hospitals, Delhi',
        contact: '+91-11-4910-4910',
        qualification: 'MD, DMRD',
        experience: '15 years',
        email: 'rajesh.kumar@apollohospitals.com',
<<<<<<< HEAD
        avatar: <Activity size={48} />,
=======
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
    },
    {
        _id: 'doc2',
        name: 'Dr. Sanjay Mishra',
        specialization: 'Pathologist',
        clinic: 'Apollo Diagnostic Centre, Delhi',
        contact: '+91-11-4910-8000',
        qualification: 'MD Pathology, MBBS',
        experience: '12 years',
        email: 'sanjay.mishra@apollodiagnostics.com',
<<<<<<< HEAD
        avatar: <Microscope size={48} />,
=======
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
    },
    {
        _id: 'doc3',
        name: 'Dr. Priya Sharma',
        specialization: 'Cardiologist',
        clinic: 'Max Healthcare, Delhi',
        contact: '+91-11-4141-4141',
        qualification: 'DM Cardiology, MD',
        experience: '18 years',
        email: 'priya.sharma@maxhealthcare.com',
<<<<<<< HEAD
        avatar: <HeartPulse size={48} />,
=======
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
    },
    {
        _id: 'doc4',
        name: 'Dr. Arun Patel',
        specialization: 'Neurologist',
        clinic: 'Fortis Healthcare, Delhi',
        contact: '+91-11-5599-5599',
        qualification: 'DM Neurology, MD',
        experience: '14 years',
        email: 'arun.patel@fortishealthcare.com',
<<<<<<< HEAD
        avatar: <Brain size={48} />,
=======
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
    },
];

export default function Doctors() {
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    return (
        <div className="doctors-page">
            <div className="section-header">
                <h1 className="heading-2">My Doctors</h1>
                <p className="section-subtitle">View details of your healthcare professionals</p>
            </div>

            <div className="doctors-grid">
                {DOCTORS.map((doctor) => (
                    <div
                        key={doctor._id}
                        className={`doctor-card glass-card ${selectedDoctor?._id === doctor._id ? 'doctor-card--active' : ''}`}
                        onClick={() => setSelectedDoctor(selectedDoctor?._id === doctor._id ? null : doctor)}
                    >
                        <div className="doctor-card__avatar">
                            <Icon name="stethoscope" size={24} color="var(--color-primary)" />
                        </div>
                        <h3 className="doctor-card__name">{doctor.name}</h3>
                        <p className="doctor-card__spec">{doctor.specialization}</p>

                        {selectedDoctor?._id === doctor._id && (
                            <div className="doctor-card__details">
                                <div className="doctor-card__detail">
                                    <span className="doctor-card__label">Clinic:</span>
                                    <span>{doctor.clinic}</span>
                                </div>
                                <div className="doctor-card__detail">
                                    <span className="doctor-card__label">Qualification:</span>
                                    <span>{doctor.qualification}</span>
                                </div>
                                <div className="doctor-card__detail">
                                    <span className="doctor-card__label">Experience:</span>
                                    <span>{doctor.experience}</span>
                                </div>
                                <div className="doctor-card__detail">
                                    <span className="doctor-card__label">Contact:</span>
                                    <a href={`tel:${doctor.contact}`} className="doctor-card__link">
                                        <Icon name="phone" size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                        {doctor.contact}
                                    </a>
                                </div>
                                <div className="doctor-card__detail">
                                    <span className="doctor-card__label">Email:</span>
                                    <a href={`mailto:${doctor.email}`} className="doctor-card__link">
                                        <Icon name="mail" size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                        {doctor.email}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
