const UserModel = require("../Models/User");

/**
 * @desc Get all users (including other admins, but excluding self)
 * @route GET /api/admin/users
 * @access Private (Admin)
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ _id: { $ne: req.user.id } }, "-password"); 
        
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching users", error: err.message });
    }
};

/**
 * @desc Delete a user by their ID
 * @route DELETE /api/admin/users/:userId
 * @access Private (Admin)
 */
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting user", error: err.message });
    }
};

/**
 * @desc Get all expenses from all users
 * @route GET /api/admin/expenses
 * @access Private (Admin)
 */
const getAllExpenses = async (req, res) => {
    try {
        // This pipeline already correctly gets expenses from all users regardless of role.
        const allExpenses = await UserModel.aggregate([
            { $unwind: "$expenses" },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    userName: "$name",
                    userEmail: "$email",
                    expenseId: "$expenses._id",
                    text: "$expenses.text",
                    amount: "$expenses.amount",
                    createdAt: "$expenses.createdAt"
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.status(200).json({ success: true, count: allExpenses.length, data: allExpenses });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching expenses", error: err.message });
    }
};

/**
 * @desc Delete a specific expense for a specific user
 * @route DELETE /api/admin/users/:userId/expenses/:expenseId
 * @access Private (Admin)
 */
const deleteUserExpense = async (req, res) => {
    const { userId, expenseId } = req.params;

    try {
        const result = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.status(200).json({ success: true, message: "Expense deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting expense", error: err.message });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getAllExpenses,
    deleteUserExpense
};

