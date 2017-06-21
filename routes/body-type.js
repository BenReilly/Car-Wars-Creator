'use strict';

const BodyType = require('../models/body-type.js');

module.exports = function(app) {

    // read one body
    app.get('/body-types/:bodytype', (req, res) => {
        BodyType.findOne({ 'type': req.params.bodytype })
            .exec((err, bodyType) => {
                if (err) {
                    res.json({ info: 'no such body type', error: err });
                    return;
                };
                if (bodyType) {
                    res.json({ info: 'got a body', data: bodyType });
                    return;
                } else {
                    res.status(500).json({ info: 'body type not found' });
                    return;
                };
            });
    });

    // read multiple bodies
    app.get('/body-types', (req, res) => {
        BodyType.find(req.query)
            .exec((err, bodyTypes) => {
                if (err) {
                    res.status(500).json({ info: 'couldn\'t find body types', error: err });
                    return;
                };
                if (bodyTypes) {
                    if (bodyTypes.length > 0) {
                        res.json({ info: 'got the bodies', data: bodyTypes });
                        return;
                    } else {
                        res.status(500).json({ info: 'one or more body type properities or values are invalid' });
                        return;
                    }
                };
            });
    });
}