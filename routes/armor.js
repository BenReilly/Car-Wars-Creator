'use strict';

const Armor = require('../models/armor.js');

module.exports = function(app) {
    const _bodyTypes = [];

    // read one body
    app.get('/armor/:armor', (req, res) => {
        Armor.findOne({ 'armor': req.params.armor })
            .exec((err, armor) => {
                if (err) {
                    res.json({ info: 'no such armor', error: err });
                    return;
                };
                if (armor) {
                    res.json({ info: 'got an armor', data: armor });
                    return;
                } else {
                    res.status(500).json({ info: 'armor not found' });
                    return;
                };
            });
    });

    // read multiple armors
    app.get('/armor', (req, res) => {
        Armor.find(req.query)
            .exec((err, armors) => {
                if (err) {
                    res.status(500).json({ info: 'couldn\'t find armor', error: err });
                    return;
                };
                if (armors) {
                    if (armors.length > 0) {
                        res.json({ info: 'got the armor', data: armors });
                        return;
                    } else {
                        res.status(500).json({ info: 'one or more armor properities or values are invalid' });
                        return;
                    }
                };
            });
    });
}