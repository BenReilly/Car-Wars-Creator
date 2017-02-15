let mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

let carSchema = mongoose.Schema({
    name: String,
    chassis: String,
    owner: {
        type: ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Car', carSchema);