const UserModel = require("../Models/User");
const mongoose = require('mongoose');

const addTransaction = async (req, res) => {
    const { id: userId } = req.user;
    const { text, amount, createdAt } = req.body;

    if (!text || !amount || !createdAt) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const newExpense = { text, amount, createdAt };

    try {
        const userData = await UserModel.findByIdAndUpdate(
            userId,
            { $push: { expenses: newExpense } },
            { new: true, runValidators: true }
        );

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // After adding, refetch all expenses to return the updated list
        const updatedUser = await UserModel.findById(userId);

        res.status(200).json({
            message: "Expense added successfully",
            success: true,
            data: updatedUser.expenses
        });
    } catch (err) {
        console.error("Error adding transaction:", err);
        return res.status(500).json({
            message: "Something went wrong",
            error: err.message,
            success: false
        });
    }
};


// --- THIS FUNCTION IS UPDATED FOR FILTERING ---
const getAllTransactions = async (req, res) => {
    const { id: userId } = req.user;
    const { startDate, endDate } = req.query;

    try {
        const matchStage = {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        };

        const projectStage = {
            $project: {
                expenses: {
                    $filter: {
                        input: "$expenses",
                        as: "expense",
                        cond: {
                            $and: [
                                startDate ? { $gte: ["$$expense.createdAt", new Date(startDate)] } : {},
                                endDate ? { $lte: ["$$expense.createdAt", new Date(endDate)] } : {}
                            ]
                        }
                    }
                }
            }
        };
        
        const pipeline = [matchStage, projectStage];

        const result = await UserModel.aggregate(pipeline);

        if (result.length === 0) {
            return res.status(200).json({
                message: "No user found or no expenses match the criteria",
                success: true,
                data: []
            });
        }

        res.status(200).json({
            message: "Fetched Expenses successfully",
            success: true,
            data: result[0].expenses
        });

    } catch (err) {
        console.error("Error fetching transactions:", err);
        return res.status(500).json({
            message: "Something went wrong",
            error: err.message,
            success: false
        });
    }
};


const deleteTransaction = async (req, res) => {
    const { id: userId } = req.user;
    const { expenseId } = req.params;

    try {
        const userData = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true }
        );
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            message: "Expense Deleted successfully",
            success: true,
            data: userData.expenses
        });
    } catch (err) {
        console.error("Error deleting transaction:", err);
        return res.status(500).json({
            message: "Something went wrong",
            error: err.message,
            success: false
        });
    }
};


module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction
};
