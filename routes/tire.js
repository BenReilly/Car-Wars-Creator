'use strict';

const Tire = require('../models/tire.js');

module.exports = function(app) {
    const _suspensions = [];

    // read one suspension
    app.get('/tires/:tire', (req, res) => {
        Tire.findOne({
                'tire': req.param.tire
            })
            .exec((err, tire) => {
                if (err) {
                    res.status(500).json({ info: 'no tire found', error: err });
                    return;
                };
                if (tire) {
                    res.json({ info: 'you are tired', data: tire });
                    return;
                } else {
                    res.status(500).json({ info: 'no tire' });
                    return;
                };
            });
    });

    // read multiple suspensions
    app.get('/tires', (req, res) => {
        Suspension.find(req.query)
            .exec((err, tires) => {
                if (err) {
                    res.status(500).json({ info: 'could not match tires', error: err });
                    return;
                };
                if (tires) {
                    if (tires.length > 0) {
                        res.json({ info: 'got tires', data: tires });
                        return;
                    } else {
                        res.status(500).json({ info: 'one or more tire properities or values are invalid' });
                        return;
                    };
                };
            });
    });
}