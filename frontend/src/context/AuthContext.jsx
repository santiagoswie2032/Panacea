import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

function authReducer(state, action) {
    switch (action.type) {
        case 'AUTH_LOADING':
            return { ...state, isLoading: true };
        case 'AUTH_SUCCESS':
            return { user: action.payload, isAuthenticated: true, isLoading: false };
        case 'AUTH_FAILURE':
        case 'LOGOUT':
            return { user: null, isAuthenticated: false, isLoading: false };
        case 'UPDATE_USER':
            return { ...state, user: { ...state.user, ...action.payload } };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check auth by calling /api/auth/me — cookie is sent automatically
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await api.getMe();
                dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
            } catch {
                dispatch({ type: 'AUTH_FAILURE' });
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        dispatch({ type: 'AUTH_LOADING' });
        try {
            const { data } = await api.login({ email, password });
            // Cookie is set by the server automatically
            dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
            return data;
        } catch (error) {
            dispatch({ type: 'AUTH_FAILURE' });
            throw error;
        }
    };

    const register = async (name, email, password) => {
        dispatch({ type: 'AUTH_LOADING' });
        try {
            const { data } = await api.register({ name, email, password });
            dispatch({ type: 'AUTH_SUCCESS', payload: data.user });
            return data;
        } catch (error) {
            dispatch({ type: 'AUTH_FAILURE' });
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.logout(); // server clears the cookie
        } catch {
            // ignore
        }
        dispatch({ type: 'LOGOUT' });
    };

    const updateUser = (userData) => {
        dispatch({ type: 'UPDATE_USER', payload: userData });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

export default AuthContext;
