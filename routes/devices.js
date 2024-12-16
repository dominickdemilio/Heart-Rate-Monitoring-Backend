const express = require('express');
const User = require('../models/User');
const Device = require('../models/Device');
const { authenticateToken } = require('../utils/auth');
const router = express.Router();

// Add device
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { access_token, particle_id, name, timeRange, frequency } =
            req.body;

        // Create a new device
        const newDevice = await Device.create({
            userId: req.user.id,
            access_token,
            particle_id,
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

// Update device details
router.put('/update/:deviceId', authenticateToken, async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { timeRange, frequency } = req.body;

        const device = await Device.findById(deviceId);

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Update device details
        if (timeRange) device.timeRange = timeRange;
        if (frequency !== undefined) device.frequency = frequency;

        await device.save();

        res.status(200).json({
            message: 'Device updated successfully',
            device,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a user's devices
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

// Get weekly summary data
router.get('/summary/:deviceId/weekly', authenticateToken, async (req, res) => {
    try {
        const { deviceId } = req.params;

        const device = await Device.findById(deviceId);

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Determine first day to get data for
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Get raw data
        const weeklyData = device.timeSeriesData.filter(
            (data) => new Date(data.timestamp) >= oneWeekAgo
        );

        // Calculate average, min, max
        const heartRates = weeklyData.map((data) => data.heartRate);
        const average =
            heartRates.reduce((sum, value) => sum + value, 0) /
                heartRates.length || 0;
        const min = Math.min(...heartRates);
        const max = Math.max(...heartRates);

        res.status(200).json({ average, min, max });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get detailed daily data
router.get('/details/:deviceId/daily', authenticateToken, async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { date } = req.query;

        const device = await Device.findById(deviceId);

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Start time
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        // End time
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Get raw data
        const dailyData = device.timeSeriesData.filter(
            (data) =>
                new Date(data.timestamp) >= targetDate &&
                new Date(data.timestamp) < nextDay
        );

        res.status(200).json({ dailyData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
