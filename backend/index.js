const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const AuthRouter = require('./Routes/AuthRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter');
const adminRoutes = require("./Routes/adminRoutes"); 
const ensureAuthenticated = require('./Middlewares/Auth');
const userRoutes = require('./Routes/User');
require('./Models/db');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.get('/ping', (req, res) => res.send('PONG'));

console.log("Loading authentication routes...");
app.use('/api/auth', AuthRouter);

console.log("Loading admin routes...");
app.use("/api/admin", adminRoutes);

console.log("Loading expense routes...");
app.use('/api/expenses', ensureAuthenticated, require('./Routes/ExpenseRouter'));

console.log("Loading user (income) routes...");
app.use('/api/user',  ensureAuthenticated,userRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

