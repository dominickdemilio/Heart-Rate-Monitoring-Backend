const express = require('express');
const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const router = express.Router();

// Register a new User
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const user = new User({ email, password, firstName, lastName });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
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

module.exports = router;