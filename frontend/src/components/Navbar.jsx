import { NavLink, useLocation } from 'react-router-dom';
<<<<<<< HEAD
import { Home, Pill, FolderOpen, Stethoscope, User, HeartPulse } from 'lucide-react';
import './Navbar.css';

const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Home' },
    { path: '/medications', icon: <Pill size={24} />, label: 'Meds' },
    { path: '/documents', icon: <FolderOpen size={24} />, label: 'Docs' },
    { path: '/doctors', icon: <Stethoscope size={24} />, label: 'Doctors' },
    { path: '/profile', icon: <User size={24} />, label: 'Profile' },
=======
import Icon from './Icon';
import './Navbar.css';

const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/medications', icon: 'pill', label: 'Meds' },
    { path: '/documents', icon: 'folder', label: 'Docs' },
    { path: '/doctors', icon: 'stethoscope', label: 'Doctors' },
    { path: '/profile', icon: 'user', label: 'Profile' },
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
];

export default function Navbar() {
    const location = useLocation();

    return (
        <>
            {/* Top header bar */}
            <header className="top-bar">
                <NavLink to="/" className="top-bar__brand">
<<<<<<< HEAD
                    <span className="top-bar__logo"><HeartPulse size={24} /></span>
=======
                    <Icon name="plusCircle" size={22} color="var(--color-primary)" />
>>>>>>> 4a483e9be3d8af39f7a5e7fe5a94b2b0476bbf74
                    <span className="top-bar__title">Panacea</span>
                </NavLink>
                <NavLink to="/emergency" className="sos-button" aria-label="Emergency SOS">
                    SOS
                </NavLink>
            </header>

            {/* Bottom navigation */}
            <nav className="bottom-nav" aria-label="Main navigation">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`
                        }
                        end={item.path === '/'}
                    >
                        <span className="bottom-nav__icon">
                            <Icon
                                name={item.icon}
                                size={20}
                                color={location.pathname === item.path ? 'var(--color-primary)' : 'currentColor'}
                            />
                        </span>
                        <span className="bottom-nav__label">{item.label}</span>
                        {location.pathname === item.path && (
                            <span className="bottom-nav__indicator" />
                        )}
                    </NavLink>
                ))}
            </nav>
        </>
    );
}
