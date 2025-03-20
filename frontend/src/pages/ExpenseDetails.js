import React from 'react'
import './ExpenseTable.css'

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    const balance = Math.max(0, incomeAmt - expenseAmt);

    return (
        <div style={{ margin: "20px auto", maxWidth: "90%", textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>
                Your Balance is ₹ {balance}
            </div>
            
            {/* Show Income & Expense amount */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                background: "#f8f2f7",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "10px",
                fontSize: "18px",
                width: "100%",
                maxWidth: "350px",
                marginLeft: "auto",
                marginRight: "auto"
            }}>
                <div style={{ flex: "1", textAlign: "center", minWidth: "120px" }}>
                    Income <br />
                    <span style={{ color: "green", fontWeight: "bold" }}>₹{incomeAmt}</span>
                </div>
                <div style={{ flex: "1", textAlign: "center", minWidth: "120px" }}>
                    Expense <br />
                    <span style={{ color: "red", fontWeight: "bold" }}>₹{expenseAmt}</span>
                </div>
            </div>
        </div>
    );
}

export default ExpenseDetails;
