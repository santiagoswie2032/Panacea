import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, HeartPulse, Database, Pill, FileText } from 'lucide-react';
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
                        <span className="login-logo-icon"><HeartPulse size={32} /></span>
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
                                    <span className="input-icon"><User size={20} /></span>
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
                                <span className="input-icon"><Mail size={20} /></span>
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
                                <span className="input-icon"><Lock size={20} /></span>
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
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                                <>Sign In &nbsp;<ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></>
                            ) : (
                                <>Create Account &nbsp;<ArrowRight size={16} style={{ verticalAlign: 'middle' }} /></>
                            )}
                        </button>
                    </form>

                    {/* Features strip */}
                    <div className="login-features">
                        <span className="login-feature"><Lock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Secure Auth</span>
                        <span className="login-feature"><Database size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Local Storage</span>
                        <span className="login-feature"><Pill size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Medications</span>
                        <span className="login-feature"><FileText size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Documents</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
