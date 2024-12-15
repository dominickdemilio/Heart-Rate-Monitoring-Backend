const express = require('express');
const cors = require('cors'); // Import CORS middleware
const axios = require('axios'); // Import axios for Particle API requests
const app = express();

// Generate a random API Key
const API_KEY = 'ip505f1w3i986bhbaqi99'; // Example API Key
console.log(`Generated API Key: ${API_KEY}`); // Print the generated API Key on server startup

// Particle configuration
const PARTICLE_ACCESS_TOKEN = 'c52115ea9877e6e6872a6d1af3063d3e42b7aa2b'; // Particle access token
const PARTICLE_DEVICE_ID = 'e00fce6834abc7249e822f6f'; //  Particle device ID
const PARTICLE_FUNCTION_NAME = 'storeString'; // name registered on the Particle device
const customString = '6:22:5000';
// Enable CORS
app.use(cors());
app.use(express.json());

// POST route: /activity
app.post('/activity', async (req, res) => {
    const { API_Key, temp1, temp2 } = req.body; // Extract variables from the request body

    // Check if API Key is valid
    const isValidApiKey = API_Key === API_KEY;

    console.log('Validation Result:', isValidApiKey ? 'Success' : 'Failure');
    console.log('Extracted temp1:', temp1);
    console.log('Extracted temp2:', temp2);
    console.log('Custom String:', customString);

    if (isValidApiKey) {
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
    } else {
        res.status(403).json({
            message: 'Failure: Invalid API Key',
            received: req.body, // Echo back the received JSON
        });
    }
});

// Start the server
const PORT = 3000; // Use port 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
