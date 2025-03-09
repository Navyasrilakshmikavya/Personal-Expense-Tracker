const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Expense = require("../Models/Expense");
const { adminUserAuthenticate } = require("../Middlewares/adminUserAuthenticate");

// Get all users (Admin only)
router.get("/users", adminUserAuthenticate, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Delete a user (Admin only)
router.delete("/users/:id", adminUserAuthenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Get all expenses (Admin only)
router.get("/expenses", adminUserAuthenticate, async (req, res) => {
  try {
    const expenses = await Expense.find().populate("user", "name email");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// Delete an expense (Admin only)
router.delete("/expenses/:id", adminUserAuthenticate, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting expense" });
  }
});

module.exports = router;