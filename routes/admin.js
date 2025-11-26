const express = require('express');
const URL = require('../model/url');
const { restrictTo } = require('../middleware/auth');

const router = express.Router();

// Fix old URLs without createdBy
router.post('/fix-old-urls', restrictTo(['Admin']), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Update all URLs where createdBy is null
        const result = await URL.updateMany(
            { createdBy: null },
            { $set: { createdBy: req.user._id } }
        );

        return res.json({
            success: true,
            message: `Fixed ${result.modifiedCount} URLs`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error fixing old URLs:', error);
        return res.status(500).json({ error: 'Failed to fix old URLs' });
    }
});

module.exports = router;
