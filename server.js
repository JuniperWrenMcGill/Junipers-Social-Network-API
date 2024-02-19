require('dotenv').config(); 
const express = require('express');
const connectDB = require('./config/connection');

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
