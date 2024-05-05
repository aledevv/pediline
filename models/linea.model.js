const mongoose = require('mongoose');

const lineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter line name'],
        },
        color: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true
    },
);

const Line = mongoose.model('Linea', lineSchema);
module.exports = Line;