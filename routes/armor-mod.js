'use strict';

const Armor = require('../models/armor-mods.js');

module.exports = function(app) {

    // read one body
    app.get('/armor-mods/:armor', (req, res) => {
        Armor.findOne({ 'armor': req.params.armor })
            .exec((err, armor) => {
                if (err) {
                    res.json({ info: 'no such armor mod', error: err });
                    return;
                };
                if (armor) {
                    res.json({ info: 'got an armor mod', data: armor });
                    return;
                } else {
                    res.status(500).json({ info: 'armor mod not found' });
                    return;
                };
            });
    });

    // read multiple armors
    app.get('/armor-mods', (req, res) => {
        Armor.find(req.query)
            .exec((err, armors) => {
                if (err) {
                    res.status(500).json({ info: 'couldn\'t find armor mods', error: err });
                    return;
                };
                if (armors) {
                    if (armors.length > 0) {
                        res.json({ info: 'got the armor mods', data: armors });
                        return;
                    } else {
                        res.status(500).json({ info: 'one or more armor mod properities or values are invalid' });
                        return;
                    }
                };
            });
    });
}