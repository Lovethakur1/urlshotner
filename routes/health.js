const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', async (req, res) => {
    const healthCheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'disconnected'
    };

    try {
        // Check database connection
        if (mongoose.connection.readyState === 1) {
            healthCheck.database = 'connected';
            return res.status(200).json(healthCheck);
        } else {
            healthCheck.status = 'ERROR';
            return res.status(503).json(healthCheck);
        }
    } catch (error) {
        healthCheck.status = 'ERROR';
        healthCheck.database = 'error';
        healthCheck.error = error.message;
        return res.status(503).json(healthCheck);
    }
});

module.exports = router;
