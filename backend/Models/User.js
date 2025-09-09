const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    expenses: [
        {
            text: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    income: {  
        type: Number,
        default: 0, // 🔹 Ensure default value is set
    }

});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
