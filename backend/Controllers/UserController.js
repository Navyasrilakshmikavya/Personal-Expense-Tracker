const UserModel = require("../Models/User");

// Get user's income
const getUserIncome = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const user = await UserModel.findById(userId).select('income');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, income: user.income || 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error getting income" });
    }
};

// Update user's income
const updateUserIncome = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { income } = req.body;

        if (income === undefined || typeof income !== 'number') {
            return res.status(400).json({ message: "A valid income amount is required" });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { income: income } },
            { new: true }
        ).select('income');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Income updated successfully",
            income: updatedUser.income
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error updating income" });
    }
};

module.exports = { getUserIncome, updateUserIncome };

