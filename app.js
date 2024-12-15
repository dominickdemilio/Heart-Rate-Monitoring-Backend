const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Database connection details
const mongoURI = 'mongodb://127.0.0.1:27017/heart-track'; // Local MongoDB database
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

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
