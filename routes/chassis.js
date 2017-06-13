'use strict';

const Chassis = require('../models/chassis.js');

module.exports = function(app) {
    const chassis = [];

    // read one chassis
    app.get('/chassis/:chassis', (req, res) => {
        console.log(req.params.chassis);
        Chassis.findOne({ 'strength': req.params.chassis })
            .exec((err, chassis) => {
                if (err) {
                    res.json({ info: 'no such chassis type', error: err });
                    return;
                };
                if (chassis) {
                    res.json({ info: 'got a chassis', data: chassis });
                    return;
                } else {
                    res.status(500).json({ info: 'chassis not found' });
                    return;
                };
            });
    });

    // read multiple chassis
    app.get('/chassis', (req, res) => {
        Chassis.find(req.query)
            .exec((err, chassis) => {
                if (err) {
                    res.status(500).json({ info: 'couldn\'t find chassis', error: err });
                    return;
                };
                if (chassis) {
                    if (chassis.length > 0) {
                        res.json({ info: 'got the chassis', data: chassis });
                        return;
                    } else {
                        res.status(500).json({ info: 'one or more chassis properities or values are invalid' });
                        return;
                    }
                };
            });
    });
};