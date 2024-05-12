var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *  schemas:
 *   List:
 *    type: object
 *    properties:
 *     day:
 *      type: string
 *     leaders:
 *      type: array
 *      items:
 *       type: string
 *     studentsPresent:
 *      type: array
 *      items:
 *       type: string
 *     studentsAbsent:
 *      type: array
 *      items:
 *       type: string
 *    required:
 *     - day
 *     - leaders
 *     - studentsPresent
 *     - studentsAbsent
 *    example:
 *      day: "2024-05-12"
 *      leaders: ["leader1", "leader2"]
 *      studentsPresent: ["student1", "student2"]
 *      studentsAbsent: ["student3", "student4"]
 */
				
// set up a mongoose model
module.exports = mongoose.model('List', new Schema({ 
	day: String,
	leaders: Array,
    studentsPresent: Array,
    studentsAbsent: Array
}));
