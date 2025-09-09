import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// --- Helper Components for Icons ---

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ExpenseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// --- Main Admin Panel Component ---

function AdminPanel() {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authentication error: No token found.");
            setLoading(false);
            return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const [usersResponse, expensesResponse] = await Promise.all([
                axios.get('https://personal-expense-tracker-jnqb.onrender.com/api/admin/users', config),
                axios.get('https://personal-expense-tracker-jnqb.onrender.com/api/admin/expenses', config)
            ]);
            setUsers(usersResponse.data.data || []);
            setExpenses(expensesResponse.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred fetching data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
        else setLoading(false);
    }, [user]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user and all their data?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://personal-expense-tracker-jnqb.onrender.com/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete user.");
        }
    };

    const handleDeleteExpense = async (userId, expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://personal-expense-tracker-jnqb.onrender.com/api/admin/users/${userId}/expenses/${expenseId}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete expense.");
        }
    };
    
    if (loading) {
        return <div style={styles.centeredPage}><div style={styles.loadingText}>Loading Dashboard...</div></div>;
    }
    
    if (error) {
        return <div style={styles.centeredPage}><div style={styles.errorBox}>{error}</div></div>;
    }

    return (
        <>
            <style>{`
                /* --- Base Styles --- */
                .admin-panel-container {
                    background-color: #f1f5f9;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    color: #334155;
                }
                .admin-header {
                    background-color: white;
                    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
                    z-index: 20;
                    flex-shrink: 0;
                }
                .header-content {
                    max-width: 1280px; margin: auto; display: flex;
                    justify-content: space-between; align-items: center; padding: 1rem;
                }
                .header-title {
                    font-size: 1.125rem; font-weight: bold; color: #1e293b;
                }
                .logout-button {
                    padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 600;
                    color: white; background-color: #ef4444; border: none;
                    border-radius: 0.5rem; cursor: pointer; transition: background-color 0.2s;
                }
                .logout-button:hover { background-color: #dc2626; }
                .container {
                    max-width: 1280px; margin: auto; padding: 1rem;
                    flex-grow: 1; overflow: hidden; display: flex;
                }
                .main-content {
                    background-color: white; border-radius: 0.75rem;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); width: 100%;
                    display: flex; flex-direction: column; overflow: hidden;
                }
                .tabs-container {
                    border-bottom: 1px solid #e2e8f0; padding: 0 1.5rem; flex-shrink: 0;
                }
                .tabs-nav {
                    margin-bottom: -1px; display: flex; gap: 1.5rem;
                }
                .tab-button {
                    display: flex; align-items: center; gap: 0.5rem; white-space: nowrap;
                    padding: 1rem 0.25rem; border-bottom: 2px solid transparent;
                    font-weight: 600; font-size: 0.875rem; color: #64748b;
                    cursor: pointer; transition: all 0.2s; background: none; border-top: none;
                    border-left: none; border-right: none;
                }
                .tab-button:hover { color: #334155; border-color: #cbd5e1; }
                .tab-button.active { border-color: #6366f1; color: #4f46e5; }
                .content-area { flex-grow: 1; overflow-y: auto; }
                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table thead {
                    position: sticky; top: 0; background-color: white; z-index: 10;
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                }
                .admin-table th {
                    padding: 1rem 1.5rem; text-align: left; font-size: 0.75rem;
                    font-weight: 600; color: #475569; text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .admin-table th:last-child { text-align: right; }
                .admin-table tbody { background-color: white; }
                .admin-table tr { border-bottom: 1px solid #e2e8f0; }
                .admin-table tr:hover { background-color: #f8fafc; }
                .admin-table td { padding: 1rem 1.5rem; white-space: nowrap; font-size: 0.875rem; }
                .admin-table td:last-child { text-align: right; }
                .role-badge {
                    padding: 0.25rem 0.75rem; display: inline-flex; font-size: 0.75rem;
                    font-weight: 600; border-radius: 9999px;
                }
                .role-admin { background-color: #e0e7ff; color: #3730a3; }
                .role-user { background-color: #dcfce7; color: #166534; }
                .delete-button {
                    display: inline-flex; align-items: center; gap: 0.5rem;
                    padding: 0.25rem 0.75rem; color: #dc2626; background-color: #fee2e2;
                    border-radius: 0.375rem; border: none; cursor: pointer; transition: all 0.2s;
                }
                .delete-button:hover { color: #991b1b; background-color: #fecaca; }
                .empty-state { text-align: center; color: #64748b; padding: 4rem 0; }
                .table-wrapper { padding: 1.5rem; }

                /* --- Mobile Responsive Styles --- */
                @media (max-width: 768px) {
                    .container { padding: 0.5rem; }
                    .table-wrapper { padding: 0; }
                    .admin-table thead { display: none; } /* Hide table headers on mobile */
                    .admin-table tbody {
                        display: block;
                    }
                    .admin-table tr {
                        display: block;
                        border: 1px solid #e2e8f0;
                        border-radius: 0.5rem;
                        margin-bottom: 1rem;
                        padding: 0.75rem;
                        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                    }
                    .admin-table td {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        text-align: right;
                        padding: 0.75rem 0.5rem;
                        position: relative;
                        white-space: normal;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .admin-table td:last-child { border-bottom: none; }
                    .admin-table td::before {
                        content: attr(data-label);
                        font-weight: 600;
                        color: #475569;
                        text-align: left;
                        margin-right: 1rem;
                    }
                    .admin-table td[data-label="Actions"] {
                        justify-content: flex-end;
                    }
                     .admin-table td[data-label="Actions"]::before {
                        display:none;
                    }
                    .tabs-nav { justify-content: center; }
                    .tab-button span { display: none; } /* Hide text label on small screens */
                }
            `}</style>

            <div className="admin-panel-container">
                <header className="admin-header">
                    <div className="header-content">
                        <h1 className="header-title">Admin Dashboard</h1>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </div>
                </header>
                
                <div className="container">
                     <main className="main-content">
                        <div className="tabs-container">
                            <nav className="tabs-nav" aria-label="Tabs">
                                <button onClick={() => setActiveTab('users')} className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}>
                                    <UserIcon /> <span>User Management ({users.length})</span>
                                </button>
                                <button onClick={() => setActiveTab('expenses')} className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}>
                                    <ExpenseIcon /> <span>Expense Management ({expenses.length})</span>
                                </button>
                            </nav>
                        </div>
                        
                        <div className="content-area">
                            <div className="table-wrapper">
                                {activeTab === 'users' && (
                                    users.length > 0 ? (
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>User ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((u) => (
                                                    <tr key={u._id}>
                                                        <td data-label="User ID" style={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}>{u._id}</td>
                                                        <td data-label="Name" style={{ fontWeight: 500, color: '#0f172a' }}>{u.name}</td>
                                                        <td data-label="Email" style={{wordBreak: 'break-all'}}>{u.email}</td>
                                                        <td data-label="Role">
                                                            <span className={`role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}`}>{u.role}</span>
                                                        </td>
                                                        <td data-label="Actions">
                                                            <button onClick={() => handleDeleteUser(u._id)} className="delete-button"><TrashIcon /> Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (<div className="empty-state">No other users found.</div>)
                                )}

                                {activeTab === 'expenses' && (
                                    expenses.length > 0 ? (
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>User</th><th>Description</th><th>Amount</th><th>Date</th><th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {expenses.map((exp) => (
                                                    <tr key={exp.expenseId}>
                                                        <td data-label="User" style={{ fontWeight: 500, color: '#0f172a' }}>{exp.userName}</td>
                                                        <td data-label="Description">{exp.text}</td>
                                                        <td data-label="Amount">${exp.amount.toFixed(2)}</td>
                                                        <td data-label="Date">{formatDate(exp.createdAt)}</td>
                                                        <td data-label="Actions">
                                                            <button onClick={() => handleDeleteExpense(exp.userId, exp.expenseId)} className="delete-button"><TrashIcon /> Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (<div className="empty-state">No expenses found in the system.</div>)
                                )}
                            </div>
                        </div>
                     </main>
                </div>
            </div>
        </>
    );
}

const styles = {
    centeredPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f1f5f9' },
    loadingText: { fontSize: '1.25rem', color: '#475569' },
    errorBox: { padding: '1.5rem', textAlign: 'center', color: '#b91c1c', backgroundColor: '#fee2e2', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
};

export default AdminPanel;

