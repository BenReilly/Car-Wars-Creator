'use strict';

const mongoose = require('mongoose'),
    config = require('../config'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema;

const ArmorSchema = new Schema({
    bodyType: {
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
    }
});

module.exports = mongoose.model('ArmorType', ArmorSchema);