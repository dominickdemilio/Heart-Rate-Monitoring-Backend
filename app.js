const express = require('express');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = 8000;

// Enable CORS
app.use(cors());
app.use(express.json());

app.get('/api/weekly-summary', (req, res) => {
    const summary = {
        average: 72,
        min: 60,
        max: 119,
    };
    res.json(summary);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
