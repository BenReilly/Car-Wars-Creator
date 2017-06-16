'use strict';

const mongoose = require('mongoose'),
    config = require('../config'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema,
    PowerPlantSchema = new Schema({
        vehicle: {
            type: String,
            required: true,
            enum: config.vehicles
        },
        plant: {
            type: String,
            required: true,
            enum: ['small', 'medium', 'large', 'super', 'sport', 'thundercat', 'small cycle', 'medium cycle', 'large cycle', 'super cycle', 'super trike']
        },
        price: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        spaces: {
            type: Number,
            required: true
        },
        dp: {
            type: Number,
            required: true
        },
        powerFactors: {
            type: Number,
            required: true
        }
    });

module.exports = mongoose.model('PowerPlant', PowerPlantSchema);