var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Student', new Schema({ 
	email: String,
	password: String,
	type: String,
	line: mongoose.Schema.Types.ObjectId,
	stop: mongoose.Schema.Types.ObjectId
}));