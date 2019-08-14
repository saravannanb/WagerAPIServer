var paypal = require('paypal-rest-sdk');
var express = require('express');
var path = require('path');
var router = express.Router();
var http = require('http');
var fs = require('fs');
//var _ = require('underscore');

//var constants = require('../config/constants.js');

//var modelObj = require('../models/');

var paypal_config = require('../../paymentlib/paypal_config.js');

paypal.configure(paypal_config);

var sender_batch_id = Math.random().toString(36).substring(9);

function createPayoutJson(recipientEmailId, payoutAmount, trxnCurrnecy) {
    var new_payout_json = {
        "sender_batch_header": {
            "sender_batch_id": sender_batch_id,
            "email_subject": "You have a payment"
        },
        "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": payoutAmount,
                    "currency": trxnCurrnecy
                },
                "receiver": recipientEmailId,
                "note": "Thank you.",
                "sender_item_id": "item_1"
            }
        ]
    };
    return new_payout_json;
}

router.post('/payout', function(req, res){
    var out;
    var data = req.body;
    
    data.currency =  (data.hasOwnProperty('currency') ? data.currency : 'USD');

    console.log('Body : ' + req.body);
    console.log('Email : ' + data.recipientEmailId);
    console.log('Amount : ' + data.amount);
    console.log('CCY : ' + data.currency);

    var payout_json = createPayoutJson(data.recipientEmailId, data.amount, data.currency);

    var sync_mode = 'false';
 
    paypal.payout.create(payout_json, sync_mode, function (error, payout) {
        if(error){
            out = {'error':true,'message':error,'data':[]};
        }else {
            out = {'error':false,'message':'Payment made successfully','data':payout};
        }

        return res.json(out);
    });
});

router.get('/', function(req, res){
    var out;

    paypal.webProfile.get(id, function(error, authorization){
        if(error){
            out = {'error':true,'message':error,'data':[]};
        }else {
            out = {'error':false,'message':'Payment made successfully','data':payout};
        }

        return res.json(out);
    });    
});

module.exports = router;