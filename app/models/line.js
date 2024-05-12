var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * @openapi
 * components:
 *  schemas:
 *   Line:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *     color:
 *      type: string
 *     stops:
 *      type: array
 *      items:
 *       type: string
 *    required:
 *     - name
 *    example:
 *      name: "Line 1"
 *      color: "green"
 *      stops: ["stop1_ID", "stop2_ID"]
 */
				

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