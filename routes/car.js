let _ = require('lodash');
let Car = require('../models/car.js');

module.exports = function(app) {

    _cars = [];

    /* Read */
    app.get('/car', function(req, res) {
        Car.find(function(err, cars) {
            if (err) {
                res.json({info: 'no cars have been made', error: err});
                return;
            };
            res.json({info: 'Here are your cars', data: cars});
        });
    });

    app.get('/car/:id', function (req, res) {
        Car.findById(req.params.id, function (err, car) {
            if (err) {
                res.json({info: 'Can\'t find that car', error: err});
                return;
            };
            if (car) {
                res.json({info: 'here\'s your car', data: car});
            } else {
                res.json({info: 'dunno where that car is'});
                return;
            };
        });
    });

    /* write */
    app.post('/car', function (req, res) {
        let newCar = new Car (req.body);
        newCar.save(function (err) {
            if (err) {
                res.json({info: 'the factory broke down', error: err});
                return;
            };
            res.json({info: 'car created, dude'});
        });
    });

    /* update */
    app.put('/car/:id', function (req, res) {
        Car.findById(req.params.id, function (err, car) {
            if (err) {
                res.json({info: 'couldn\'t remodel that car', error: err});
                return;
            };
            if (car) {
                _.merge(car, req.body);
                car.save(function (err){
                    if (err) {
                        res.json({info: 'car remodel failed', error: err});
                        return;
                    };
                    res.json({info: 'car successfully remodeled'});
                });
            } else {
                res.json({info: 'couldn\'t find a car to remodel'});
                return;
            };
        });
        let index = _.findIndex(
            _cars,
            {
                name: req.params.id
            }
        );
    });

    /* destroy */
    app.delete('/car/:id', function (req, res) {
        Car.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.json({info: 'could not trash car', error: err});
                return;
            };
            res.json({info: 'trashed car ' + req.params.id});
        });
    });

};