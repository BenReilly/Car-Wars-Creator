'use strict';

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema,
    TireSchema = new Schema({
        tire: {
            type: String,
            required: true,
            enum: [ 'standard', 'heavy-duty', 'puncture-resistant', 'solid' ]
        },
        price: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        dp: {
            type: Number,
            required: true
        }
    });

module.exports = mongoose.model('Tire', TireSchema);