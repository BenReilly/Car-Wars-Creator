const config = require('../config.js');
const jwt = require('jsonwebtoken');

module.exports = function(app) {

    app.all('/*', function(req, res, next) {
        if (req.path.indexOf('/user') === 0 && req.method === 'POST') {
            next();
            return;
        };
        jwt.verify(req.get('token'), config.SECRET, (err, decoded) => {
            if (err) {
                res.status(403).send({ info: 'invalid token', data: err });
            } else {
                req.decoded = decoded;
                next();
            };
        });
    });

};