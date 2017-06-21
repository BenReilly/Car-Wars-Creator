'use strict';

const Weapon = require('../models/weapon');

module.exports = function(app) {
    //read one weapon
    app.get('/weapon/:weapon', (req, res) => {
        Weapon.findOne({ 'weapon': req.params.weapon })
            .exec((err, weapon) => {
                if (err) {
                    res.status(500).json({ info: 'unarmed', error: err });
                    return;
                };
                if (weapon) {
                    res.json({ info: 'loaded up', data: weapon });
                    return;
                } else {
                    res.status(500).json({ info: 'no weapon found' });
                    return;
                }
            });
    });

    // read multiple weapons
    app.get('/weapons', (req, res) => {
        Weapon.find(req.query)
            .exec((err, weapons) => {
                if (err) {
                    res.status(500).json({ info: 'error finding weapons', error: err });
                    return;
                };
                if (weapons) {
                    if (weapons.length > 0) {
                        res.json({ info: 'check out these guns', data: weapons });
                        return;
                    } else {
                        res.status(500).json({ info: 'one or more weapon properties or values is invalid' });
                        return;
                    };
                };
            });
    });
    app.get('/weapons/:category', (req, res) => {
        Weapon.find({ category: req.params.category })
            .exec((err, weapons) => {
                if (err) {
                    res.status(500).json({ info: 'error finding weapons in category', error: err });
                    return;
                };
                if (weapons) {
                    if (weapons.length > 0) {
                        res.json({ info: 'fully armed', data: weapons });
                        return;
                    } else {
                        res.status(500).json({ info: 'no weapons found' });
                        return;
                    };
                };
            });
    });
};