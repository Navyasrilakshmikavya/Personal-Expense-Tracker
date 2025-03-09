import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import { PieChart, Pie, Tooltip, Cell } from 'recharts'; // Import Recharts components

function Expenses() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState('');
    const [expenseAmt, setExpenseAmt] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    useEffect(() => {
        const amounts = expenses.map(item => Math.abs(Number(item.amount))); // Ensure positive values
        const totalExpense = amounts.reduce((acc, item) => acc + item, 0);
        setExpenseAmt(totalExpense);
    }, [expenses]);

    const deleteExpens = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE"
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    const fetchExpenses = useCallback(async () => {
        try {
            const url =  `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }, [navigate]);

    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]); 

    // 🎨 Colors for Pie Chart Segments
    const COLORS = ['#76B7B2', '#4E79A7', '#F28E2B', '#AF7AA1', '#FF9DA7'];

    // 🔄 Transform Expenses into Pie Chart Data Format
    const expenseData = expenses.map((expense, index) => ({
        name: expense.category, // Category name
        value: Math.abs(Number(expense.amount)), // Amount (Ensure it's positive)
        color: COLORS[index % COLORS.length] // Assign colors cyclically
    }));

    return (
        <div>
            <div className='user-section' style={{ textAlign: 'center',paddingTop:"100px",marginBottom: '20px' }}>
                <h1>Welcome {loggedInUser}</h1>
            </div>

            {/* Income Entry */}
            <div>
                <label htmlFor="income">Enter Your Income:</label>
                <input
                    type="number"
                    id="income"
                    placeholder="Enter your total income..."
                    value={incomeAmt}
                    onChange={(e) => setIncomeAmt(e.target.value)}
                />
            </div>

            <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />
            <ExpenseForm addTransaction={addTransaction} />
            <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />

            {/* 🎯 Pie Chart for Expense Categories */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <PieChart width={400} height={400}>
                    <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Expenses;