const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    access_token: { type: String, required: true },
    particle_id: { type: String, required: true },
    name: { type: String, required: true },
    timeRange: { start: String, end: String },
    frequency: { type: Number, required: true },
    timeSeriesData: [
        {
            timestamp: { type: Date, default: Date.now },
            heartRate: Number,
            oxygenSaturation: Number,
        },
    ],
});

module.exports = mongoose.model('Device', DeviceSchema);
