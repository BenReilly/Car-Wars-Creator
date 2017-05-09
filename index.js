let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    sodium = require('sodium').api;

mongoose.connect('mongodb://localhost/carwars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let utils = require('./routes/route.util.js')(app),
    cars = require('./routes/car.js')(app),
    users = require('./routes/user.js')(app);

let server = app.listen(3001, function() {
    console.log('Server running at http://127.0.0.1:3001/');
});