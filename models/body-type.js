'use strict';

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema;

const BodyTypeSchema = new Schema({
    vehicle: {
        type: String,
        required: true,
        enum: ['car', 'bike', 'trike']
    },
    type: {
        type: String,
        required: true,
        enum: ['subcompact',
            'compact',
            'mid-sized',
            'sedan',
            'luxury',
            'station wagon',
            'pickup',
            'camper',
            'van',
            'light cycle',
            'medium cycle',
            'heavy cycle',
            'light sidecar',
            'heavy sidecar',
            'light trike',
            'medium trike',
            'heavy trike',
            'extra-heavy trike'
        ]
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
    armorCost: {
        type: Number,
        required: true
    },
    armorWeight: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('BodyType', BodyTypeSchema);