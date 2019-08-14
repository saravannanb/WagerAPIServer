'use strict';
var express = require('express');
var path = require('path');
var router = express.Router();
var http = require('http');
var fs = require('fs');

var utils = require('../utils.js');
var StripeConnect  = require('./stripe.js');


router.post('/verifyaccount', function(req, res){
    var out;
    var data = req.body;
    
    console.log(data.paymentGridType);
    
    if(!data.paymentGridType || data.paymentGridType.trim().length == 0) {
        out = {'error':true,'message': 'Missing paymentGridType field.','data':[]};
        return res.json(out);
    }    

    switch(data.paymentGridType) {
        case 'PayPal':
            data.currency =  (data.hasOwnProperty('currency') ? data.currency : 'USD');
            break;
        case 'Stripe':
            var customerId = data.customerId;
            var stripeConnect = new StripeConnect();

            try {                
                stripeConnect.verifyAccount(customerId)
                .then(customer => {
                    out = {'error':false,'message':'Account verified successfully',
                            'data': JSON.stringify(customer)}
                    res.json(out)})
                .catch(err => {
                    out = {'error':true,'message':err.message, 'data': err.rawType};    
                    res.json(out)})                            
            }
            catch(err) {
                out = {'error':true,'message':err, 'data': JSON.stringify(err)};    
                res.json(out);                             
            }            
            
            break;
    }    
});

module.exports = router;