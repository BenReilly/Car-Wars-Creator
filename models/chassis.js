'use strict';

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema;

const ChassisSchema = new Schema({
    vehicle: {
        type: String,
        required: true,
        enum: config.vehicles
    },
});

module.exports = mongoose.model('Chassis', ChassisSchema);