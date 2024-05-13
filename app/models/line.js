var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Line', new Schema({ 
	name: String,
	color: String,
    stops: Array
}));