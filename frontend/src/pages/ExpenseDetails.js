import React from 'react';

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    const balance = Math.max(0, incomeAmt - expenseAmt);

    return (
        <div style={{ padding: '20px', background: '#ffcccc', borderRadius: '10px', width: '50%', margin: 'auto' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>
                Your Balance is ₹ {balance}
            </div>

            {/* Show Income & Expense amount */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', padding: '10px' }}>
                <div style={{ color: '#27ae60', textAlign: 'left' }}>
                    Income:
                    <div style={{ fontWeight: 'normal', fontSize: '16px' }}>₹{incomeAmt || 0}</div>
                </div>
                <div style={{ color: '#c0392b', textAlign: 'right' }}>
                    Expense:
                    <div style={{ fontWeight: 'normal', fontSize: '16px' }}>₹{expenseAmt || 0}</div>
                </div>
            </div>
        </div>
    );
}

export default ExpenseDetails;