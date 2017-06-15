'use strict';

const mongoose = require('mongoose'),
    config = require('../config'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema,
    SuspensionSchema = new Schema({
        vehicle: {
            type: String,
            required: true,
            enum: config.vehicles
        },
        suspensionType: {
            type: String,
            required: true,
            enum: ['light',
                'improved',
                'heavy',
                'off-road'
            ]
        },
        price: {
            type: Number,
            required: true
        },
        hc: {
            type: Number,
            required: true
        }
    });

module.exports = mongoose.model('Suspension', SuspensionSchema);