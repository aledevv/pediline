var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Line', new Schema({ 
	name: String,
	color: String,
    stops: Array
}));

// previous version

// const mongoose = require('mongoose');

// const lineSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: [true, 'Please enter line name'],
//         },
//         color: {
//             type: String,
//             required: false,
//         },
//         stops: {    // Array of stop IDs
//             type: Array,
//             required: false,
//         },
//     },
//     {
//         timestamps: true
//     },
// );

// const Line = mongoose.model('Linea', lineSchema);
// module.exports = Line;