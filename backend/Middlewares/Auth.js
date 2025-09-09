// Middlewares/Auth.js

const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    // Get the authorization header
    const authHeader = req.headers['authorization'];

    // Check if the header exists and is in the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized, JWT token is missing or malformed' });
    }

    // Extract the token from the header (split the string and take the second part)
    const token = authHeader.split(' ')[1];

    try {
        // Verify only the token part
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        // Handle expired or invalid tokens
        return res.status(401).json({ message: 'Unauthorized, JWT token is wrong or expired' });
    }
}

module.exports = ensureAuthenticated;