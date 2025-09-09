import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

// --- UTILITY FUNCTIONS ---
const APIUrl = 'http://localhost:8080';

const handleError = (err) => {
    console.error(err);
    toast.error(err.message || 'Something went wrong!');
};

const handleSuccess = (msg) => {
    toast.success(msg || 'Operation successful!');
};

// --- CHILD COMPONENTS ---

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    const balance = Math.max(0, Number(incomeAmt) - Number(expenseAmt));

    return (
        <div className="card">
              <h3 className="card-title">Your Financial Snapshot</h3>
            <div className="snapshot-balance-container">
                <p className="snapshot-label">Current Balance</p>
                <p className="snapshot-balance">
                    ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            <div className="snapshot-summary">
                <div>
                    <p className="snapshot-label">Income</p> 
                    <p className="snapshot-income">
                        ₹{Number(incomeAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div>
                    <p className="snapshot-label">Expense</p>
                    <p className="snapshot-expense">
                        ₹{Number(expenseAmt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({ amount: '', text: '', date: '' });
    const handleChange = (e) => setExpenseInfo({ ...expenseInfo, [e.target.name]: e.target.value });
    
    const addExpenses = (e) => {
        e.preventDefault();
        if (!expenseInfo.amount || !expenseInfo.text || !expenseInfo.date) {
            return handleError({ message: 'Please fill all transaction fields.' });
        }
        addTransaction({ 
            text: expenseInfo.text,
            amount: Math.abs(Number(expenseInfo.amount)),
            createdAt: expenseInfo.date 
        });
        setExpenseInfo({ amount: '', text: '', date: '' });
    };

    return (
        <div className="card">
            <h3 className="card-title">Add New Transaction</h3>
            <form onSubmit={addExpenses} className="form">
                <div>
                    <label className="form-label">Detail</label>
                    <input className="form-input" onChange={handleChange} type='text' name='text' placeholder='e.g., Coffee, Groceries...' value={expenseInfo.text} />
                </div>
                <div>
                    <label className="form-label">Amount (₹)</label>
                    <input className="form-input" onChange={handleChange} type='number' name='amount' placeholder='e.g., 150' value={expenseInfo.amount} />
                </div>
                <div>
                    <label className="form-label">Date</label>
                    <input className="form-input" onChange={handleChange} type='date' name='date' value={expenseInfo.date} />
                </div>
                <button type='submit' className="button primary-button">Add Expense</button>
            </form>
        </div>
    );
}

const ExpenseTable = ({ expenses, deleteExpens }) => (
    <div className="card">
        <h3 className="card-title">Transaction History</h3>
        <div className="transaction-list">
            {expenses.length > 0 ? (
                expenses.map((expense) => (
                    <div key={expense._id || Math.random()} className="transaction-item">
                        <div className="transaction-details">
                            <button className="delete-button-circle" onClick={() => deleteExpens(expense._id)}>X</button>
                            <div>
                                <p className="transaction-text">{expense.text}</p>
                                <p className="transaction-date">{new Date(expense.createdAt).toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>
                        <span className="transaction-amount">
                            - ₹{Math.abs(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                ))
            ) : (
                <p className="empty-state">No transactions found for the selected period.</p>
            )}
        </div>
    </div>
);


// --- MAIN APP COMPONENT ---
function Expenses() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const navigate = useNavigate();

    const [filters, setFilters] = useState({ startDate: '', endDate: '' });
    const [appliedFilters, setAppliedFilters] = useState({ startDate: '', endDate: '' });

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    useEffect(() => {
        const total = expenses.reduce((acc, item) => acc + Number(item.amount), 0);
        setExpenseAmt(total);
    }, [expenses]);

    const deleteExpens = async (id) => {
        try {
            const response = await fetch(`${APIUrl}/api/expenses/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to delete');
            handleSuccess(result.message);
            setExpenses(result.data || []);
        } catch (err) {
            handleError(err);
        }
    };

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        
        try {
            let expensesUrl = `${APIUrl}/api/expenses`;
            const params = new URLSearchParams();
            if (appliedFilters.startDate) params.append('startDate', appliedFilters.startDate);
            if (appliedFilters.endDate) params.append('endDate', appliedFilters.endDate);
            if (params.toString()) {
                expensesUrl += `?${params.toString()}`;
            }

            const expenseRes = await fetch(expensesUrl, { headers: { 'Authorization': `Bearer ${token}` } });
            const expenseResult = await expenseRes.json();
            if (expenseResult.success) setExpenses(expenseResult.data || []);

            const incomeRes = await fetch(`${APIUrl}/api/user/income`, { headers: { 'Authorization': `Bearer ${token}` } });
            const incomeResult = await incomeRes.json();
            if (incomeResult.success) setIncomeAmt(incomeResult.income);

        } catch (err) {
            handleError(err);
        }
    }, [navigate, appliedFilters]);

    const addTransaction = async (data) => {
        try {
            const response = await fetch(`${APIUrl}/api/expenses`, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to add');
            handleSuccess(result.message);
            fetchData();
        } catch (err) {
            handleError(err);
        }
    };

    const handleIncomeSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${APIUrl}/api/user/update-income`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ income: Number(incomeAmt) })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to update');
            handleSuccess(result.message);
        } catch (err) {
            handleError(err);
        }
    };
    
    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const applyFilters = () => {
        setAppliedFilters(filters);
    };

    const clearFilters = () => {
        setFilters({ startDate: '', endDate: '' });
        setAppliedFilters({ startDate: '', endDate: '' });
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const COLORS = ['#6366f1', '#818cf8', '#a78bfa', '#c4b5fd', '#d5d6f6'];
    const expenseData = expenses.length > 0 ? expenses.map((expense) => ({
        name: expense.text,
        value: Math.abs(Number(expense.amount)),
    })) : [{ name: 'No Expenses', value: 1 }];

    return (
        <>
        <style>{`
            .page-container {
                font-family: 'Inter', sans-serif;
                background-color: #f0f2f5;
                color: #333;
                min-height: 100vh;
                padding: 20px;
            }
            .header {
                text-align: center;
                padding-top: 40px;
                margin-bottom: 20px;
            }
            .welcome-message {
                font-size: 2.5rem;
                font-weight: 600;
                color: #1a202c;
                padding-top:20px;
            }
            .main-content {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 24px;
                max-width: 1200px;
                margin: 0 auto;
            }
            .column {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }
            .card {
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                padding: 24px;
            }
            .card-title {
                font-size: 1.25rem;
                font-weight: 600;
                margin-bottom: 20px;
                color: #2d3748;
            }
            .form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .form-label {
                display: block;
                margin-bottom: 6px;
                font-size: 0.875rem;
                font-weight: 500;
            }
            .form-input {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #cbd5e0;
                border-radius: 8px;
                font-size: 1rem;
                box-sizing: border-box;
            }
            .button {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                border: none;
            }
            .primary-button {
                background: linear-gradient(90deg, #4f46e5, #6366f1);
                color: white;
                box-shadow: 0 2px 4px rgba(79, 70, 229, 0.4);
            }
            .secondary-button {
                background: #e2e8f0;
                color: #4a5568;
            }
            .snapshot-balance-container { text-align: center; margin-bottom: 20px; }
            .snapshot-label { font-size: 1rem; color: #718096; margin: 0; }
            .snapshot-balance { font-size: 2.5rem; font-weight: bold; color: #2d3748; margin: 4px 0; }
            .snapshot-summary { display: flex; justify-content: space-around; background: #f7fafc; padding: 15px; border-radius: 8px; margin-top: 10px; font-size: 1rem; }
            .snapshot-income { color: #38a169; font-weight: 600; margin: 4px 0; }
            .snapshot-expense { color: #e53e3e; font-weight: 600; margin: 4px 0; }
            .transaction-list { max-height: 400px; overflow-y: auto; padding-right: 10px; }
            .transaction-item { background: #f8fafc; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .transaction-details { display: flex; align-items: center; gap: 15px; }
            .delete-button-circle { background: #fee2e2; color: #ef4444; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: bold; }
            .transaction-text { font-weight: 500; margin: 0; }
            .transaction-date { font-size: 0.875rem; color: #718096; margin: 2px 0 0 0; }
            .transaction-amount { color: #e53e3e; font-weight: 600; }
            .empty-state { text-align: center; color: #a0aec0; padding: 20px 0; }
            .filter-container { display: flex; flex-direction: column; gap: 16px; }
            .filter-inputs { display: flex; gap: 16px; align-items: center; }
            .filter-buttons { display: flex; gap: 16px; margin-top: 10px; }
            .filter-buttons .button { flex: 1; }

            /* --- MOBILE STYLES --- */
            @media (max-width: 768px) {
                .page-container { padding: 10px; }
                .header { padding-top: 20px; }
                .welcome-message { font-size: 1.8rem; }
                .main-content { grid-template-columns: 1fr; }
                .card { padding: 16px; }
                .filter-inputs { flex-direction: column; align-items: stretch; }
            }
        `}</style>
        <div className="page-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <header className="header">
                <h1 className="welcome-message">Welcome, {loggedInUser || 'User'}</h1>
            </header>

            <main className="main-content">
                <div className="column">
                    <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />
                    <div className="card">
                        <h3 className="card-title">Update Your Income</h3>
                        <form onSubmit={handleIncomeSubmit} className="form">
                            <div>
                                <label className="form-label">Total Monthly Income (₹)</label>
                                <input type="number" value={incomeAmt} onChange={(e) => setIncomeAmt(e.target.value)} className="form-input" />
                            </div>
                            <button type="submit" className="button primary-button">Update Income</button>
                        </form>
                    </div>
                    <ExpenseForm addTransaction={addTransaction} />
                </div>
                <div className="column">
                    <div className="card" style={{ minHeight: '300px' }}>
                         <h3 className="card-title">Expense Breakdown</h3>
                         <ResponsiveContainer width="100%" height={300}>
                             <PieChart>
                                 <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                     {expenseData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                     ))}
                                 </Pie>
                                 <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`}/>
                             </PieChart>
                         </ResponsiveContainer>
                    </div>
                    
                    <div className="card">
                        <h3 className="card-title">Filter Transactions</h3>
                        <div className="filter-container">
                            <div className="filter-inputs">
                                <div style={{flex: 1}}>
                                    <label className="form-label">Start Date</label>
                                    <input className="form-input" type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
                                </div>
                                <div style={{flex: 1}}>
                                    <label className="form-label">End Date</label>
                                    <input className="form-input" type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
                                </div>
                            </div>
                            <div className="filter-buttons">
                               <button onClick={applyFilters} className="button primary-button">Apply Filter</button>
                               <button onClick={clearFilters} className="button secondary-button">Clear Filter</button>
                            </div>
                        </div>
                    </div>

                    <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />
                </div>
            </main>
        </div>
        </>
    );
}

export default Expenses;

