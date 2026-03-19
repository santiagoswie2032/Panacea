import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';
import './Login.css';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const toast = useToast();

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const switchMode = (toLogin) => {
        setIsLogin(toLogin);
        setForm({ name: '', email: '', password: '' });
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(form.email, form.password);
                toast.success('Welcome back!');
            } else {
                await register(form.name, form.email, form.password);
                toast.success('Account created successfully!');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Animated gradient background */}
            <div className="login-bg">
                <div className="login-bg__orb login-bg__orb--1" />
                <div className="login-bg__orb login-bg__orb--2" />
                <div className="login-bg__orb login-bg__orb--3" />
            </div>

            <div className="login-container">
                {/* Brand header */}
                <div className="login-header">
                    <div className="login-logo">
                        <span className="login-logo-icon">
                            <Icon name="plusCircle" size={36} color="var(--color-primary)" />
                        </span>
                        <div className="login-logo-ring" />
                    </div>
                    <h1 className="login-title">Panacea</h1>
                    <p className="login-subtitle">Your Personal Medical Assistant</p>
                </div>

                {/* Card */}
                <div className="login-card glass-card">
                    {/* Tabs */}
                    <div className="login-tabs" role="tablist">
                        <button
                            role="tab"
                            aria-selected={isLogin}
                            className={`login-tab ${isLogin ? 'login-tab--active' : ''}`}
                            onClick={() => switchMode(true)}
                            type="button"
                        >
                            Sign In
                        </button>
                        <button
                            role="tab"
                            aria-selected={!isLogin}
                            className={`login-tab ${!isLogin ? 'login-tab--active' : ''}`}
                            onClick={() => switchMode(false)}
                            type="button"
                        >
                            Sign Up
                        </button>
                        <div className={`login-tab-indicator ${isLogin ? 'login-tab-indicator--left' : 'login-tab-indicator--right'}`} />
                    </div>

                    <form onSubmit={handleSubmit} className="login-form" noValidate>
                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="login-name">Full Name</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">
                                        <Icon name="user" size={16} />
                                    </span>
                                    <input
                                        id="login-name"
                                        className="form-input form-input--icon"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        required={!isLogin}
                                        autoComplete="name"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="login-email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <Icon name="mail" size={16} />
                                </span>
                                <input
                                    id="login-email"
                                    className="form-input form-input--icon"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="login-password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <Icon name="lock" size={16} />
                                </span>
                                <input
                                    id="login-password"
                                    className="form-input form-input--icon form-input--padded-right"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    required
                                    minLength={6}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                />
                                <button
                                    type="button"
                                    className="input-toggle-btn"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={-1}
                                >
                                    <Icon name={showPassword ? 'eyeOff' : 'eye'} size={16} />
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit-btn"
                            type="submit"
                            className="btn btn--primary btn--lg btn--block login-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner spinner--sm" />
                            ) : isLogin ? (
                                <>Sign In &nbsp;<Icon name="arrowRight" size={16} /></>
                            ) : (
                                <>Create Account &nbsp;<Icon name="arrowRight" size={16} /></>
                            )}
                        </button>
                    </form>

                    {/* Features strip */}
                    <div className="login-features">
                        <span className="login-feature"><Icon name="lock" size={12} /> Secure Auth</span>
                        <span className="login-feature"><Icon name="shield" size={12} /> Encrypted</span>
                        <span className="login-feature"><Icon name="pill" size={12} /> Medications</span>
                        <span className="login-feature"><Icon name="folder" size={12} /> Documents</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
