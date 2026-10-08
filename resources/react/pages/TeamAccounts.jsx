import { useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../services/api';

export default function TeamAccounts() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'member',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        // Remove the error for this field
        // when the user starts editing it.
        setErrors((previous) => ({
            ...previous,
            [name]: undefined,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setSuccess('');
        setErrors({});

        try {
            const response = await api.post('/users', form);

            setSuccess(
                response.data.message ||
                'Team account created successfully.'
            );

            setForm({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: 'member',
            });
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else if (error.response?.status === 403) {
                setErrors({
                    general: [
                        'You do not have permission to create team accounts.',
                    ],
                });
            } else {
                setErrors({
                    general: [
                        error.response?.data?.message ||
                        'Unable to create team account.',
                    ],
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>

            <div style={styles.header}>
                <div>
                    <h1>Team Accounts</h1>

                    <p>
                        Create and manage internal team accounts.
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    style={styles.backButton}
                >
                    Back to Dashboard
                </Link>
            </div>

            <div style={styles.card}>

                <h2>Create Team Account</h2>

                {success && (
                    <div style={styles.success}>
                        {success}
                    </div>
                )}

                {errors.general && (
                    <div style={styles.errorBox}>
                        {errors.general[0]}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter team member name"
                        />

                        {errors.name && (
                            <p style={styles.error}>
                                {errors.name[0]}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Enter email address"
                        />

                        {errors.email && (
                            <p style={styles.error}>
                                {errors.email[0]}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Minimum 8 characters"
                        />

                        {errors.password && (
                            <p style={styles.error}>
                                {errors.password[0]}
                            </p>
                        )}
                    </div>

                    {/* Password Confirmation */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Confirm password"
                        />
                    </div>

                    {/* Role */}
                    <div style={styles.field}>
                        <label style={styles.label}>
                            Role
                        </label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="member">
                                Member
                            </option>

                            <option value="admin">
                                Admin
                            </option>
                        </select>

                        {errors.role && (
                            <p style={styles.error}>
                                {errors.role[0]}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.button,
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading
                            ? 'Creating...'
                            : 'Create Account'}
                    </button>

                </form>
            </div>
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

    card: {
        maxWidth: '600px',
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    },

    field: {
        marginBottom: '18px',
    },

    label: {
        display: 'block',
        marginBottom: '6px',
        fontWeight: '600',
    },

    input: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '15px',
    },

    button: {
        padding: '11px 18px',
        border: 0,
        borderRadius: '8px',
        background: '#2563eb',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '15px',
    },

    backButton: {
        textDecoration: 'none',
        color: '#2563eb',
    },

    success: {
        padding: '12px',
        marginBottom: '20px',
        background: '#dcfce7',
        color: '#166534',
        borderRadius: '8px',
    },

    errorBox: {
        padding: '12px',
        marginBottom: '20px',
        background: '#fee2e2',
        color: '#991b1b',
        borderRadius: '8px',
    },

    error: {
        margin: '5px 0 0',
        color: '#dc2626',
        fontSize: '14px',
    },
};