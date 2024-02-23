// Importing required modules
const express = require('express'); // Importing Express.js framework
const db = require('./config/connection'); // Importing database connection
const routes = require('./routes'); // Importing route handlers

// Setting up port number
const PORT = process.env.PORT || 3001;

// Creating an Express application
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to use defined routes
app.use(routes);

// Once the database connection is open, start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
