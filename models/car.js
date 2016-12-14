let mongoose = require('mongoose');

let carSchema = mongoose.Schema({
    name: String,
    chassis: String,
    owner: String
});

module.exports = mongoose.model('Car', carSchema);