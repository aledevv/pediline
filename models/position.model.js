const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
    {
        latitudine: {
            type: Number,
        },
        longitudine: {
            type: Number,
        }
    },
    {
        timestamps: true
    }
);


const Position = mongoose.model('Posizione', positionSchema);
module.exports = Position;
