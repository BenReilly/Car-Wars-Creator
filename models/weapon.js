'use strict';

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    Schema = mongoose.Schema,
    WeaponSchema = new Schema({
        weapon: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: [
                'small-bore projectile',
                'large-bore projectile',
                'rockets',
                'lasers',
                'flamethrowers',
                'dropped liquids',
                'dropped solids',
                'dropped gases'
            ]
        },
        toHit: {
            type: Number
        },
        damage: {
            type: String
        },
        dp: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        space: {
            type: Number,
            required: true
        },
        magazineSize: {
            type: Number,
            required: function() {
                let rocketPacks = ['micromissle launcher', 'multi-fire rocket pod', 'rocket launcher'];
                let isRocketPack = rocketPacks.indexOf(this.weapon) > 0;
                return !(this.category === 'lasers' ||
                    (this.category === 'rockets' && !isRocketPack));
            }
        },
        loadedPrice: {
            type: Number,
            required: function() { return this.magazineSize != null; }
        },
        loadedWeight: {
            type: Number,
            required: function() { return this.magazineSize != null; }
        },
        magazinePrice: {
            type: Number,
            required: function() { return this.magazineSize != null; }
        },
        magazineWeight: {
            type: Number,
            required: function() { return this.magazineSize != null; }
        },
        effect: {
            type: String,
            enum: [
                'burst',
                'area'
            ]
        },
        notes: {
            type: String
        }
    });



module.exports = mongoose.model('Weapon', WeaponSchema);