const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter school name'],
        },
        schedule: {
            type: String,
            required: [true, 'Please enter the schedule'],
        },
        positionId: {
            type: Array,
            required: [true, 'Please enter a valid position'],
        }
    },
    {
        timestamps: true
    },
);

const Fermata = mongoose.model('Fermata', stopSchema);
module.exports = Fermata;
