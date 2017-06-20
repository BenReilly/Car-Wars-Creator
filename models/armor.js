'use strict';

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema;

const ArmorSchema = new Schema({
    armor: {
        type: String,
        required: true,
        enum: ['fireproof', 'laser-reflective fireproof', 'laser-reflective', 'laser-reflective metal', 'metal']
    },
    material: {
        type: String,
        required: true,
        enum: ['plastic', 'metal']
    },
    weight: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bonus: {
        type: String,
        required: true
    },
    repairPrice: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Armor', ArmorSchema);