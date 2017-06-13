const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    sodium = require('sodium').api,
    config = require('./config');

mongoose.connect(config.mongodb);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let utils = require('./routes/route.util.js')(app),
    cars = require('./routes/car.js')(app),
    users = require('./routes/user.js')(app),
    bodyTypes = require('./routes/body-type.js')(app);

if (!module.parent) {
    app.listen(config.port, function() {
        console.log('Server running at http://127.0.0.1:' + config.port + '/');
    });
}

module.exports = app;