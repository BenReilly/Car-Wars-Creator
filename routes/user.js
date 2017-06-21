'use strict';

const _ = require('lodash'),
    User = require('../models/user.js'),
    config = require('../config.js'),
    jwt = require('jsonwebtoken');

module.exports = function(app) {

    let _users = [];

    // read
    app.get('/user', (req, res) => {
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
    app.get('/user/:id', (req, res) => {
        User.findById(req.params.id)
            .select({ username: 1, cars: 1 })
            .exec(function(err, user) {
                if (err) {
                    res.json({ info: 'i don\'t know that guy', error: err });
                    return;
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
    app.post('/user/isvalid', (req, res) => {
        User.find({ username: req.body.username }, function(err, user) {
            if (err) {
                res.status(403).json({ info: 'invalid username/password combo', error: err });
            };
            if (user[0]) {
                if (!!req.body.password && user[0].comparePassword(req.body.password)) {
                    // make a token
                    let tokenData = jwt.sign({
                            uid: user[0]._id,
                            isAdmin: user[0].admin || false
                        },
                        config.SECRET, { expiresIn: '4h' }
                    );
                    res.status(200)
                        .set({ token: tokenData })
                        .json({
                            userid: user[0]._id,
                            info: 'login successful'
                        });
                } else {
                    // login fail
                    res.status(403).json({ info: 'invalid username/password combo' });
                };
            } else {
                res.status(403).json({ info: 'invalid username/password combo' });
            };
        });
    });

    // write
    app.post('/user', (req, res) => {
        let newUser = new User(req.body);
        if (!newUser.username || newUser.username.length < 1 || typeof newUser.username !== "string") {
            res.status(400).json({ info: 'you must have a username' });
            return;
        }
        if (!newUser.password || newUser.password.length < 1) {
            res.status(400).json({ info: 'you must create a password' });
            return;
        }
        newUser.save(function(err) {
            if (err) {
                res.status(400).json({ info: 'user creation failed', error: err });
                return;
            };
            res.json({ info: 'it\'s alive!' });
        });
    });

    // update
    app.put('/user/:id', (req, res) => {
        if (req.params.id !== req.decoded.uid && req.decoded.isAdmin !== true) {
            res.status(403).json({ info: 'you can only edit yourself' });
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
    app.delete('/user/:id', (req, res) => {
        if (req.params.id !== req.decoded.uid && req.decoded.isAdmin !== true) {
            res.status(403).json({ info: 'you cannot delete other users' });
            return;
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