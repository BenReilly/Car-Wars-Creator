'use strict';

const TireMod = require('../models/tire-mod.js');

module.exports = function(app) {
    const _tireMods = [];

    // read one tire
    app.get('/tire-mods/:mod', (req, res) => {
        console.log(req.params.mod);
        TireMod.findOne({
                'mod': req.params.mod
            })
            .exec((err, mod) => {
                if (err) {
                    res.status(500).json({ info: 'no tire-mod found', error: err });
                    return;
                };
                if (mod) {
                    res.json({ info: 'you are modified', data: mod });
                    return;
                } else {
                    res.status(500).json({ info: 'no tire-mod' });
                    return;
                };
            });
    });

    // read multiple tires
    app.get('/tire-mods', (req, res) => {
        TireMod.find(req.query)
            .exec((err, mods) => {
                if (err) {
                    res.status(500).json({ info: 'could not match tire-mods', error: err });
                    return;
                };
                if (mods) {
                    if (mods.length > 0) {
                        res.json({ info: 'got mods', data: mods });
                        return;
                    } else {
                        res.status(500).json({ info: 'one or more tire-mod properities or values are invalid' });
                        return;
                    };
                };
            });
    });
}