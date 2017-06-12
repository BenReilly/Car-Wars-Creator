'use strict';

const BodyType = require('../models/body-type.js');

module.exports = function(app) {
    const _bodyTypes = [];

    app.get('/body-types/:vehicle', (req, res) => {
        BodyType.find({});
    });
}