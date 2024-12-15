const express = require('express');
const User = require('../models/User');
const Device = require('../models/Device');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

// Add device
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { name, timeRange, frequency } = req.body;

        // Create a new device
        const newDevice = await Device.create({
            userId: req.user.id,
            name,
            timeRange,
            frequency,
            timeSeriesData: [],
        });

        // Add device ID to the user's devices list
        const user = await User.findById(req.user.id);
        user.devices.push(newDevice._id);
        await user.save();

        res.status(201).json({
            message: 'Device added successfully',
            device: newDevice,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove device
router.delete('/remove/:deviceId', authenticateToken, async (req, res) => {
    try {
        const { deviceId } = req.params;

        // Remove device from the Device collection
        await Device.findByIdAndDelete(deviceId);

        // Remove device reference from the user's devices list
        const user = await User.findById(req.user.id);
        user.devices = user.devices.filter((id) => id.toString() !== deviceId);
        await user.save();

        res.status(200).json({
            message: 'Device removed successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's devices
router.get('/', authenticateToken, async (req, res) => {
    try {
        const devices = await Device.find({ userId: req.user.id });
        res.status(200).json({ devices });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add time series data to a device
router.post('/add-data/:deviceId', authenticateToken, async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { heartRate, oxygenSaturation } = req.body;

        const device = await Device.findById(deviceId);

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        device.timeSeriesData.push({ heartRate, oxygenSaturation });
        await device.save();

        res.status(201).json({
            message: 'Data added successfully',
            timeSeriesData: device.timeSeriesData,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
