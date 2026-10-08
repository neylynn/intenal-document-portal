import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser);
        } catch (error) {
            localStorage.removeItem('user');
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        api.get('/me')
            .then((response) => {
                const currentUser = response.data.user;

                setUser(currentUser);

                localStorage.setItem(
                    'user',
                    JSON.stringify(currentUser)
                );
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/login', {
            email,
            password,
        });

        const { token, user } = response.data;

        localStorage.setItem('token', token);

        localStorage.setItem(
            'user',
            JSON.stringify(user)
        );

        setUser(user);

        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch {
            // Token may already be expired.
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}