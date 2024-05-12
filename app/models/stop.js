var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *  schemas:
 *   Stop:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *     schedule:
 *      type: string
 *     position:
 *      type: array
 *      items:
 *       type: number
 *    required:
 *     - name
 *     - schedule
 *     - position
 *    example:
 *      name: "Stop 1"
 *      schedule: "08:00 - 08:30"
 *      position: [40.7128, -74.0060]
 */
				
// set up a mongoose model
module.exports = mongoose.model('Stop', new Schema({ 
	name: String,
	schedule: String,
    position: Array
}));
