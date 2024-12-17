const express = require('express');
const axios = require('axios'); // Import axios for Particle API requests
const router = express.Router();

// Particle configuration
// const PARTICLE_ACCESS_TOKEN = 'c52115ea9877e6e6872a6d1af3063d3e42b7aa2b'; // Particle access token
// const PARTICLE_DEVICE_ID = 'e00fce6834abc7249e822f6f'; //  Particle device ID
const PARTICLE_FUNCTION_NAME = 'storeString'; // name registered on the Particle device
const customString = '6:22:8000'; // format:    HH.mm

// POST route: /activity
router.post('/activity', async (req, res) => {
    try {
        // Send the custom string to the Particle device
        const response = await axios.post(
            `https://api.particle.io/v1/devices/${PARTICLE_DEVICE_ID}/${PARTICLE_FUNCTION_NAME}`,
            new URLSearchParams({
                access_token: PARTICLE_ACCESS_TOKEN,
                arg: customString, // The string to send to the Particle device
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        console.log('Particle response:', response.data);

        // Respond to the client with success
        res.status(200).json({
            message: 'Success! String sent to Particle device.',
            received: req.body, // Echo back the received JSON
            particleResponse: response.data, // Include Particle response for transparency
        });
    } catch (error) {
        console.error(
            'Error sending string to Particle:',
            error.response ? error.response.data : error.message
        );
        res.status(500).json({
            message: 'Failure: Could not send string to Particle device.',
            error: error.message,
        });
    }
});

module.exports = router;
