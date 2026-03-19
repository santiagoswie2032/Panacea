import { NavLink, useLocation } from 'react-router-dom';
import Icon from './Icon';
import './Navbar.css';

const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/medications', icon: 'pill', label: 'Meds' },
    { path: '/boxes', icon: 'folder', label: 'Boxes' },
    { path: '/documents', icon: 'folder', label: 'Docs' },
    { path: '/doctors', icon: 'stethoscope', label: 'Doctors' },
    { path: '/profile', icon: 'user', label: 'Profile' },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <>
            {/* Top header bar */}
            <header className="top-bar">
                <NavLink to="/" className="top-bar__brand">
                    <Icon name="plusCircle" size={22} color="var(--color-primary)" />
                    <span className="top-bar__title">Panacea</span>
                </NavLink>
                <div className="top-bar__actions">
                    <NavLink to="/map" className="map-button" aria-label="Nearby Medical Facilities">
                        <Icon name="map" size={18} />
                    </NavLink>
                    <NavLink to="/emergency" className="sos-button" aria-label="Emergency SOS">
                        SOS
                    </NavLink>
                </div>
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
