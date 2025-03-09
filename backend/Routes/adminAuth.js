const express = require("express");
const router = express.Router();
const User = require("../Models/User"); 
const bcrypt = require("bcryptjs");
const Expense = require("../Models/Expense");
const adminUserAuthenticate  = require("../Middlewares/adminUserAuthenticate");


// ✅ Create Admin (Only if doesn't exist)
router.get("/create-admin", async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("Admin1@", 10);

    const admin = new User({
      name: "Navya",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    res.json({ message: "Admin created successfully", admin });
  } catch (err) {
    console.log("Internal server error from adminAuth", err);
    return res.status(500).json({ message: "Internal server error from adminAuth" });
  }
});

// ✅ Add Another Admin (Admin Only)
router.get("/add-admin", async (req, res) => {
  try{
    // Hash the password
    const hashedPassword = await bcrypt.hash("Admin2@", 10);

    // Create new admin user
    const newAdmin = new User({
      name:"Sivani",
      email:"admin2@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    await newAdmin.save();
    res.status(201).json({ message: "New admin added successfully", newAdmin });
  } catch (err) {
    console.error("Error adding new admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get all users (Admin only)
router.get("/users", adminUserAuthenticate, async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// ✅ Delete a user (Admin only)
router.delete("/users/:id", adminUserAuthenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// ✅ Get all expenses (Admin only)
router.get("/expenses", adminUserAuthenticate, async (req, res) => {
  try {
    const expenses = await Expense.find().populate("user", "name email");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// ✅ Edit an expense (Admin only)
router.put("/expenses/:id", adminUserAuthenticate, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount, category, date },
      { new: true } // Return updated document
    );
    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json({ message: "Expense updated", updatedExpense });
  } catch (err) {
    res.status(500).json({ error: "Error updating expense" });
  }
});

// ✅ Delete an expense (Admin only)
router.delete("/expenses/:id", adminUserAuthenticate, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting expense" });
  }
});

module.exports = router;