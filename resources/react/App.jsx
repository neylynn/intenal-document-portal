import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import TeamAccounts from './pages/TeamAccounts';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AdminRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    user ? (
                        <Navigate to="/dashboard" replace />
                    ) : (
                        <Login />
                    )
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/documents"
                element={
                    <ProtectedRoute>
                        <Documents />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/team-accounts"
                element={
                    <AdminRoute>
                        <TeamAccounts />
                    </AdminRoute>
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to={user ? '/dashboard' : '/login'}
                        replace
                    />
                }
            />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}