'use strict';

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema;

const ChassisSchema = new Schema({
    strength: {
        type: String,
        required: true,
        enum: ['light', 'standard', 'heavy', 'extra heavy']
    },
    weight: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Chassis', ChassisSchema);