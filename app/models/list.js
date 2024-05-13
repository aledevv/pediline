var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('List', new Schema({ 
	day: String,
	leaders: Array,
    studentsPresent: Array,
    studentsAbsent: Array
}));
