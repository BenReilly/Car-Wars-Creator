'use strict';

const PowerPlant = require('../models/power-plant.js');

module.exports = function(app) {
    const _powerPlant = [];

    // read one power plant
    app.get('/power-plants/:powerPlant', (req, res) => {
        PowerPlant.findOne({ 'plant': req.params.powerPlant })
            .exec((err, powerPlant) => {
                if (err) {
                    res.status(500).json({ info: 'no power plant found', error: err });
                    return;
                };
                if (powerPlant) {
                    res.json({ info: 'you got the power', data: powerPlant });
                    return;
                } else {
                    res.status(500).json({ info: 'no power plant' });
                    return;
                };
            });
    });

    // read multiple power plants
    app.get('/power-plants', (req, res) => {
        PowerPlant.find(req.query)
            .exec((err, powerPlants) => {
                if (err) {
                    res.status(500).json({ info: 'could not match power plants', error: err });
                    return;
                };
                if (powerPlants) {
                    if (powerPlants.length > 0) {
                        res.json({ info: 'got power plants', data: powerPlants });
                        return;
                    } else {
                        res.status(500).json({ info: 'one or more power plant properities or values are invalid' });
                        return;
                    };
                };
            });
    });
}