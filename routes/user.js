const _ = require('lodash');
const User = require('../models/user.js');
const consts = require('../consts/consts.js');
const jwt = require('jsonwebtoken');

module.exports = function(app) {

    const _users = [];

    // read
    app.get('/user', function(req, res) {
        User.find()
            .select({ username: 1, cars: 1 })
            .exec(function(err, users) {
                if (err) {
                    res.json({ info: 'user error. Har har.', error: err });
                    return;
                };
                if (users.length > 0) {
                    res.json({ info: 'i got you some users', data: users });
                } else {
                    res.json({ info: 'no users here' });
                };
            });
    });

    // read just one user
    app.get('/user/:id', function(req, res) {
        User.findById(req.params.id)
            .select({ username: 1, cars: 1 })
            .exec(function(err, user) {
                if (err) {
                    res.json({ info: 'i don\'t know that guy', error: err });
                };
                if (user) {
                    let returnUser = {
                        id: user._id,
                        username: user.username,
                        cars: user.cars
                    }
                    res.json({ info: 'here\'s your guy', data: returnUser });
                } else {
                    res.json({ info: 'guy not found' });
                };
            });
    });

    // validate 
    app.post('/user/isvalid', function(req, res) {
        User.find({ username: req.body.username }, function(err, user) {
            if (err) {
                res.json({ info: 'login failed', error: err });
            };
            if (user[0]) {
                if (user[0].comparePassword(req.body.password)) {
                    // make a token
                    let tokenData = jwt.sign({
                            uid: user[0]._id,
                            isAdmin: user[0].admin || false
                        },
                        consts.SECRET, { expiresIn: '4h' }
                    );
                    res.json({
                        info: 'login successful',
                        token: tokenData
                    });
                } else {
                    // login fail
                    res.json({ info: 'login failed bad password' });
                };
            } else {
                res.json({ info: 'login failed bad user' });
            };
        });
    });

    // write
    app.post('/user', function(req, res) {
        let newUser = new User(req.body);
        newUser.save(function(err) {
            if (err) {
                res.json({ info: 'user creation failed', error: err });
                return;
            };
            res.json({ info: 'it\'s alive!' });
        });
    });

    // update
    app.put('/user/:id', function(req, res) {
        if (req.params.id !== req.decoded.uid && req.decoded.isAdmin !== true) {
            res.json({ info: 'you can only edit yourself' });
            return;
        };
        User.findById(req.params.id, function(err, user) {
            if (err) {
                res.json({ info: 'the user does not want to change', error: err });
                return;
            };
            if (user) {
                Object.assign(user, req.body);
                user.save(function(err) {
                    if (err) {
                        res.json({ info: 'user could not be changed', error: err });
                        return;
                    };
                    res.json({ info: 'we rebuilt him' });
                });
            } else {
                res.json({ info: 'could not find that user' });
                return;
            };
        });
        let index = _.findIndex(_users, {
            name: req.params.id
        });
    });

    // destroy
    app.delete('/user/:id', function(req, res) {
        if (req.params.id !== req.decoded.uid && req.decoded.isAdmin !== true) {
            res.json({ info: 'you cannot delete other users' });
        };
        User.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.json({ info: 'user could not be terminated', error: err });
                return;
            };
            res.json({ info: 'terminated user ' + req.params.id });
        });
    });

};