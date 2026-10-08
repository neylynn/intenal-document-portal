import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div style={styles.container}>

            <header style={styles.header}>

                <div>
                    <h1>Internal Document Portal</h1>

                    <p>
                        Welcome, {user?.name}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    style={styles.logout}
                >
                    Logout
                </button>

            </header>

            <main>

                <div style={styles.card}>
                    <h2>Documents</h2>

                    <p>
                        Access all internal company
                        documents.
                    </p>

                    <Link
                        to="/documents"
                        style={styles.button}
                    >
                        View Documents
                    </Link>
                </div>

                {user?.role === 'admin' && (
                    <div style={styles.card}>
                        <h2>Administrator</h2>

                        <p>
                            Manage team members and create
                            internal user accounts.
                        </p>

                        <Link
                            to="/team-accounts"
                            style={styles.button}
                        >
                            Manage Team Accounts
                        </Link>
                    </div>
                )}

            </main>

        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        padding: '30px',
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },

    logout: {
        padding: '10px 18px',
        border: 0,
        borderRadius: '8px',
        background: '#dc2626',
        color: '#fff',
    },

    card: {
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '20px',
    },

    button: {
        display: 'inline-block',
        padding: '10px 16px',
        borderRadius: '8px',
        background: '#2563eb',
        color: '#fff',
        textDecoration: 'none',
    },
};