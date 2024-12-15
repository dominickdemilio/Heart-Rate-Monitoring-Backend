const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

// Add device
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.devices.push(req.body);
        await user.save();
        res.status(201).json({
            message: 'Device added successfully',
            devices: user.devices,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove device
router.delete('/remove/:deviceName', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.devices = user.devices.filter(
            (device) => device.name !== req.params.deviceName
        );
        await user.save();
        res.status(200).json({
            message: 'Device removed successfully',
            devices: user.devices,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
