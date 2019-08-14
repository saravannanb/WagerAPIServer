var createError = require('http-errors');
var express = require('express');
var fs = require("fs");
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var paypal = require('./routes/payment/paypal');
//var paypal = require('./routes/payment/paypalapi');
var paymentGrid = require('./routes/payment/paymentgrid');

var app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Wager App application."});
});


//Route mapping
app.use('/payment', paymentGrid);


// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
    next(createError(404));
});
*/
module.exports = app;