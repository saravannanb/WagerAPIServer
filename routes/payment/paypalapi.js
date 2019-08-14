var PaypalAdaptive = require('paypal-adaptive');
var express = require('express');
var path = require('path');
var router = express.Router();
var http = require('http');
var fs = require('fs');

var utils = require('../utils.js');
var paypal_config = require('../../paymentlib/paypal_config.js');

var paypal = new PaypalAdaptive(paypal_config);

function createPaymentPayloadJson(senderEmailId, recipientEmailId, payoutAmount, trxnCurrnecy) {
    var payload = {
        senderEmail : senderEmailId,
        requestEnvelope: {
            errorLanguage:  'en_US'
        },
        actionType:     'PAY',
        currencyCode:   trxnCurrnecy,
        feesPayer:      'SENDER',
        memo:           'Chained payment example',
        cancelUrl:      'http://test.com/cancel',
        returnUrl:      'http://test.com/success',
        receiverList: {
            receiver: [
                {
                    email:  recipientEmailId,
                    amount: payoutAmount
                }
            ]
        }
    };

    return payload;
}

function createVerificationPayloadJson(emailId, firstName, lastName) {
    var payload = {
        requestEnvelope: {
            errorLanguage:  'en_US'
        },
        emailAddress : emailId,
        matchCriteria : 'NAME',
        firstName : firstName,
        lastName : lastName
    };

    return payload;
}

router.post('/pay', function(req, res){
    var out;
    var data = req.body;
    
    data.currency =  (data.hasOwnProperty('currency') ? data.currency : 'USD');

    var mandatoryFields = [data.senderEmailId, data.recipientEmailId, data.amount];

    var isMandatoryOk = utils.checkMandatory(mandatoryFields);

    if(!isMandatoryOk){
        out = {'error':true,'message': 'Missing mandatory fields.','data':[]};

        return res.json(out);
    }

    var payload_json = createPaymentPayloadJson(data.senderEmailId, data.recipientEmailId, data.amount, data.currency);
    
    paypal.pay(payload_json, function (err, response) {
        if (err) {
            out = {'error':true,'message':err, 'data': response};
        } else {
            out = {'error':false,'message':'Payment created successfully, waiting for approval.','data': response};
        }   
        
        return res.json(out);
    });        
});

router.get('/getPaymentOptions', function(req, res){
    var out;
    var payKey = 'AP-72B8086302014042D';

    var payload = {
        payKey: 'AP-72B8086302014042D',
        requestEnvelope: {
            detailLevel: 'ReturnAll',
            errorLanguage:  'en_US'
        }
    };

    paypal.getPaymentOptions(payload, function (err, response) {
        if (err) {
            out = {'error':true,'message':err,'data': response};
        } else {
            out = {'error':false,'message':'Payment made successfully','data': response};
        }

        return res.json(out);
    });    
});

router.post('/VerifyAccount', function(req, res){
    var out;

    var data = req.body;

    var mandatoryFields = [data.emailId, data.firstName, data.lastName];

    var isMandatoryOk = utils.checkMandatory(mandatoryFields);

    if(!isMandatoryOk){
        out = {'error':true,'message': 'Missing mandatory fields.','data':[]};

        return res.json(out);
    }

    var payload_json = createVerificationPayloadJson(data.emailId, data.firstName, data.lastName);

    paypal.getVerifiedStatus(payload_json, function(err, response) {
        if (err) {
            out = {'error':true,'message':err,'data':response};
        } else {
            out = {'error':false,'message':'Account verified successfully','data': response};
        }

        return res.json(out);
    });
});

module.exports = router;