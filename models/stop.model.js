import { Schema, model } from 'mongoose';

const stopSchema = new Schema(
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

const Fermata = model('Fermata', stopSchema);
export default Fermata;
