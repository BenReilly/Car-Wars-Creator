let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let redis = require('redis');
let client = redis.createClient(6379, '127.0.0.1');

mongoose.connect('mongodb://localhost/carwars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let cars = require('./routes/car.js')(app);

let server = app.listen(3001, function() {
    console.log('Server running at http://127.0.0.1:3000/');
});