const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter school name'],
        },
        line: {
            type: Array,
            required: false,
        },
        positionId: {
            // ESEmpio prova type: mongoose.ObjectId,  required come te vol.   
        }
    },
    {
        timestamps: true
    },
);

const School = mongoose.model('Scuola', schoolSchema);
module.exports = School;
