var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Stop', new Schema({ 
	name: String,
	schedule: String,
    position: Array
}));

// previous version

// const mongoose = require('mongoose');

// const stopSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: [true, 'Please enter school name'],
//         },
//         schedule: {
//             type: String,
//             required: [true, 'Please enter the schedule'],
//         },
//         positionId: {
//             type: Array,
//             required: [true, 'Please enter a valid position'],
//         }
//     },
//     {
//         timestamps: true
//     },
// );

// const Fermata = mongoose.model('Fermata', stopSchema);
// module.exports = Fermata;
