import React, { useState } from 'react';
import { handleError } from '../utils';
import '../index.css';
function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        date: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text, date } = expenseInfo;

        if (!amount || !text || !date) {
            handleError('Please add Expense Details');
            return;
        }

        const expenseAmount = Math.abs(Number(amount)); // Ensuring positive value

        addTransaction({ text, amount: expenseAmount, date });

        setExpenseInfo({ amount: '', text: '', date: '' });
    };

    return (
        <div className='container'>
            <h1>Expense Tracker</h1>
            <form onSubmit={addExpenses}>
                <div>
                    <label htmlFor='text'>Expense Detail</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='text'
                        placeholder='Enter your Expense Detail...'
                        value={expenseInfo.text}
                    />
                </div>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        placeholder='Enter your Expense Amount...'
                        value={expenseInfo.amount}
                    />
                </div>
                <div>
                    <label htmlFor='date'>Date</label>
                    <input
                        onChange={handleChange}
                        type='date'
                        name='date'
                        placeholder='Select Date'
                        value={expenseInfo.date}
                    />
                </div>
                <button type='submit'>Add Expense</button>
            </form>
        </div>
    );
}

export default ExpenseForm;