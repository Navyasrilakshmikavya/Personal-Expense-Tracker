const express = require('express');
const { 
    getAllTransactions, 
    addTransaction, 
    deleteTransaction 
} = require('../Controllers/ExpenseController');
const router = express.Router();

// GET /api/expenses/ (and with query params like ?startDate=...)
router.get('/', getAllTransactions);

// POST /api/expenses/
router.post('/', addTransaction);

// DELETE /api/expenses/:expenseId
router.delete('/:expenseId', deleteTransaction);

module.exports = router;
