var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *  schemas:
 *   Calendar:
 *    type: object
 *    properties:
 *     listePresenze:
 *      type: array
 *      items:
 *       type: string
 *     bacheca:
 *      type: string
 *      format: uuid
 *    required:
 *     - listePresenze
 *     - bacheca
 *    example:
 *      listePresenze: ["event1", "event2"]
 *      bacheca: "bacheca1_ID"
 */
				
// set up a mongoose model
module.exports = mongoose.model('Calendar', new Schema({ 
	listePresenze: Array,
	bacheca: mongoose.Types.ObjectId,	// ID di un documento di tipo Bacheca
}));
