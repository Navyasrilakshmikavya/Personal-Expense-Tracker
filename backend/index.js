const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const ExpenseRouter = require('./Routes/ExpenseRouter');
const ensureAuthenticated = require('./Middlewares/Auth');
const adminRoutes=require("./Routes/adminAuth")
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => {
    res.send('PONG');
});
app.use(express.urlencoded({
    extended:true
}))
app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);
console.log("Loading admin routes...");
app.use("/api/admin",adminRoutes)
app.use('/expenses', ensureAuthenticated, ExpenseRouter)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})