import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/medications', icon: '💊', label: 'Meds' },
    { path: '/documents', icon: '📁', label: 'Docs' },
    { path: '/doctors', icon: '👨‍⚕️', label: 'Doctors' },
    { path: '/profile', icon: '👤', label: 'Profile' },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <>
            {/* Top header bar */}
            <header className="top-bar">
                <NavLink to="/" className="top-bar__brand">
                    <span className="top-bar__logo">⚕️</span>
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
                        <span className="bottom-nav__icon">{item.icon}</span>
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
