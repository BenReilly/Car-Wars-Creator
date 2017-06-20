'use strict';

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema,
    TireModSchema = new Schema({
        mod: {
            type: String,
            required: true,
            enum: ['steelbelting', 'radials', 'off-road', 'fireproofing']
        },
        price: {
            type: Number,
            required: true
        },
        weight: {
            type: String,
            required: true
        },
        dp: {
            type: String
        },
        bonus: {
            type: String
        }
    });

module.exports = mongoose.model('TireMod', TireModSchema);