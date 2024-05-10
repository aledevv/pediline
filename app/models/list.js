var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('List', new Schema({ 
	day: String,
	leaders: Array,
    studentsPresent: Array,
    studentsAbsent: Array
}));