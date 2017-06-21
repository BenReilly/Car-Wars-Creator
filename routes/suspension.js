'use strict';

const Suspension = require('../models/suspension.js');

module.exports = function(app) {

    // read one suspension
    app.get('/suspensions/:vehicle/:suspensionType', (req, res) => {
        Suspension.findOne({
                'vehicle': req.params.vehicle,
                'suspensionType': req.params.suspensionType
            })
            .exec((err, suspension) => {
                if (err) {
                    res.status(500).json({ info: 'no suspension found', error: err });
                    return;
                };
                if (suspension) {
                    res.json({ info: 'you are suspended', data: suspension });
                    return;
                } else {
                    res.status(500).json({ info: 'no suspension' });
                    return;
                };
            });
    });

    // read multiple suspensions
    app.get('/suspensions', (req, res) => {
        Suspension.find(req.query)
            .exec((err, suspensions) => {
                if (err) {
                    res.status(500).json({ info: 'could not match suspensions', error: err });
                    return;
                };
                if (suspensions) {
                    if (suspensions.length > 0) {
                        res.json({ info: 'got suspensions', data: suspensions });
                        return;
                    } else {
                        res.status(500).json({ info: 'one or more suspension properities or values are invalid' });
                        return;
                    };
                };
            });
    });
}