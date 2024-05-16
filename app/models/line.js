var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Line', new Schema({ 
	name: String,
	color: String,
	// id: mongoose.Schema.Types.ObjectId,
    stops: Array

}));