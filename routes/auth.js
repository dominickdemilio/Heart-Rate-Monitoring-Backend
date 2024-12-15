const express = require('express');
const User = require('../models/User');
const { generateToken, authenticateToken } = require('../utils/auth');

const router = express.Router();

// Register a new User
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check for missing fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        // Create and save the new User account
        const user = new User({ email, password, firstName, lastName });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Handle other errors
        res.status(400).json({ error: error.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user);
        res.status(200).json({
            token,
            user: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user account details
router.put('/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update info
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (password) user.password = password;

        await user.save();
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update user',
            error: error.message,
        });
    }
});

module.exports = router;
