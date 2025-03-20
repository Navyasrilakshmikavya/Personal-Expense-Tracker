require('dotenv').config();
const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url, {}) // Remove deprecated options
    .then(() => {
        console.log('MongoDB Connected...');
    })
    .catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    });
