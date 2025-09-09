const express = require('express');
const router = express.Router();
const { getUserIncome, updateUserIncome } = require('../Controllers/UserController');

// Handles GET requests to /api/user/income
router.get('/income', getUserIncome);

// Handles PUT requests to /api/user/income
router.put('/income', updateUserIncome);

module.exports = router;
