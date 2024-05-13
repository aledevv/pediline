var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Calendar', new Schema({ 
	listePresenze: Array,
	bacheca: mongoose.Types.ObjectId,	// ID di un documento di tipo Bacheca
}));
