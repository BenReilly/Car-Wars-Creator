const _ = require('lodash');
const User = require('../models/user.js');

module.exports = function(app) {

    _users = [];

    // read
    app.get('/user', function(req, res) {
        User.find(function(err, users) {
            if (err) {
                res.json({ info: 'no users here', error: err });
                return;
            };
            res.json({ info: 'i got you some users', data: users });
        });
    });

    app.get('/user/:id', function(req, res) {
        User.findById(req.params.id, function(err, user) {
            if (err) {
                res.json({ info: 'i don\'t know that guy', error: err });
            };
            if (user) {
                res.json({ info: 'here\'s your guy', data: user });
            } else {
                res.json({ info: 'guy not found' });
            };
        });
    });

    // validate 
    app.post('user/isvalid', function(req, res) {
        let index = _.findIndex(_users, {
            name: req.body.name
        });
        User.findById(index, function(err, user) {
            if (err) {
                res.json({ info: 'that user name or password is invalid. Maybe both.' });
            };
            if (user) {
                if (User.comparePassword(req.body.password, user)) {
                    // user login
                    res.json({ info: 'login successful' });
                };
                // login fail
                res.json({ info: 'login failed' });
            } else {
                res.json({ info: 'that user name or password is invalid. Maybe both.' });
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
        User.findById(req.params.id, function(err, user) {
            if (err) {
                res.json({ info: 'the user does not want to change', error: err });
                return;
            };
            if (user) {
                _.merge(user.req.body);
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
        User.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.json({ info: 'user could not be terminated', error: err });
                return;
            };
            res.json({ info: 'terminated user ' + req.params.id });
        });
    });

};