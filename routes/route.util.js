const consts = require('../consts/consts.js');
const jwt = require('jsonwebtoken');

module.exports = function(app) {

    app.all('/*', function(req, res, next) {
        if (req.path.indexOf('/user') === 0 && req.method === 'POST') {
            next();
            return;
        };
        jwt.verify(req.get('token'), consts.SECRET, function(err, decoded) {
            if (err) {
                res.send({ info: 'invalid token', data: err });
            } else {
                req.decoded = decoded;
                next();
            };
        });
    });

};