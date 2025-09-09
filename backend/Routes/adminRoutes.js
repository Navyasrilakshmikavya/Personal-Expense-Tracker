const express = require("express");
const router = express.Router();
const adminUserAuthenticate = require("../Middlewares/adminUserAuthenticate");
const {
    getAllUsers,
    deleteUser,
    getAllExpenses,
    deleteUserExpense
} = require("../Controllers/AdminController");

// Apply the admin authentication middleware to all routes in this file
router.use(adminUserAuthenticate);

// --- User Management ---
// GET /api/admin/users
router.get("/users", getAllUsers);

// DELETE /api/admin/users/:userId
router.delete("/users/:userId", deleteUser);

// --- Expense Management ---
// GET /api/admin/expenses
router.get("/expenses", getAllExpenses);

// DELETE /api/admin/users/:userId/expenses/:expenseId
router.delete("/users/:userId/expenses/:expenseId", deleteUserExpense);

module.exports = router;
