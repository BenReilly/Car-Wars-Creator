'use strict';

const mongoose = require('mongoose'),
    config = require('../config'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema;

const BodyTypeSchema = new Schema({
    vehicle: {
        type: String,
        required: true,
        enum: config.vehicles
    },
    type: {
        type: String,
        required: true,
        enum: config.bodyTypes
    },
    price: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    maxLoad: {
        type: Number,
        required: true
    },
    space: {
        type: Number,
        required: true
    },
    cargoSpace: {
        type: Number,
        required: true
    },
    hcModifier: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('BodyType', BodyTypeSchema);