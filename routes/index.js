const router = require('express').Router();

// Importing API routes
const userRoutes = require('./api/userRoutes');
const thoughtRoutes = require('./api/thoughtRoutes');

// Directing to respective route handlers
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;
