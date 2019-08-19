'use strict';
var express = require('express');
var path = require('path');
var router = express.Router();
var http = require('http');
var fs = require('fs');

var utils = require('../utils.js');
var PayPal = require('./paypal.js');
var Stripe  = require('./stripe.js');
var BraintTree = require('./braintree.js');


router.post('/verifycustomer', function(req, res){
    var out;
    var data = req.body;
    
    console.log(data.paymentPlatform);
    
    if(!data.paymentPlatform || data.paymentPlatform.trim().length == 0) {
        out = {'error':true,'message': 'Missing paymentPlatform field.','data':[]};
        return res.json(out);
    }    

    switch(data.paymentPlatform) {
        case 'PayPal':
            data.currency =  (data.hasOwnProperty('currency') ? data.currency : 'USD');
            break;
        case 'Stripe':
            var customerId = data.customerId;
            var stripe = new Stripe();

            try {                
                stripe.verifyCustomer(customerId)
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

router.post('/pay', function(req, res){
    var out;
    var data = req.body;
    
    console.log(data.paymentPlatform);
    
    if(!data.paymentPlatform || data.paymentPlatform.trim().length == 0) {
        out = {'error':true,'message': 'Missing paymentPlatform field.','data':[]};
        return res.json(out);
    }    

    switch (data.paymentPlatform) {
        case 'PayPal':
            data.currency =  (data.hasOwnProperty('currency') ? data.currency : 'USD');
            break;    
        case 'Stripe':
            var stripe = new Stripe();

            try {                
                stripe.transferFund(data)
                .then(transfer => {
                    out = {'error':false,'message':'Fund transfered successfully.',
                            'data': JSON.stringify(transfer)}
                    res.json(out)})
                .catch(err => {
                    out = {'error':true,'message':err.message, 'data': JSON.stringify(err)};  //err.rawType
                    res.json(out)})                            
            }
            catch(err) {
                out = {'error':true,'message':err.message, 'data': JSON.stringify(err)};  
                res.json(out);                             
            }
            break;
    }

});

//API to verify mapped Bank Account of a Stripe Customer
router.post('/verifybankaccount', function(req, res){
    var out;
    var data = req.body;
    
    console.log(data.paymentPlatform);
    
    if(!data.paymentPlatform || data.paymentPlatform.trim().length == 0) {
        out = {'error':true,'message': 'Missing paymentPlatform field.','data':[]};
        return res.json(out);
    }

    var stripe = new Stripe();

    try {                
        var bankAccount = stripe.verifyCustomerBankAccount(data)
        out = {'error':false,
            'message':'Bank account verified successfully for the customer Id - ' + JSON.stringify(bankAccount),
            'data': JSON.stringify(bankAccount)};
        res.json(out);                            
    }
    catch(err) {
        out = {'error':true,'message':err.message, 'data': JSON.stringify(err)};  
        res.json(out);                             
    }
});

//API to Add Fund to PayPal Customer Wallet
router.post('/paypal/pay', function(req, res){
    var data = req.body;    
    
    var braintree = new BraintTree();

    return braintree.addFund(data, res);
});

router.get('/getPaymentOptions', function(req, res){

    var paypal = new PayPal();

    var paymentOption = paypal.getPaymentOptions();

    console.log(paymentOption)

    return res.json(paymentOption);
});

//API to get PayPal payment transaction details
router.get('/paypalpayments/:id?', function (req,res,next) {
    var out;
    var id = req.params.id;

    var paypal = new PayPal();

    out = paypal.getPaymentTransaction(id);

    return res.json(out);
});

//API to get BrainTree Client Token
router.get('/braintree/clienttoken', function (req, res) {
    var braintree = new BraintTree();

    return braintree.getClientToken(res);    
});

module.exports = router;