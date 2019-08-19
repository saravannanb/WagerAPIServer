var PaypalAdaptive = require('paypal-adaptive');
var express = require('express');
var path = require('path');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var urlEncode = require('urlencode');

var utils = require('../utils.js');
var constants = require('../config/constants.js');
var paypal_config = require('../../paymentlib/paypal_config.js');
var paymentTrxn_modelObj=require('../models/PayPalPaymentTrxnLog');

var paypal = new PaypalAdaptive(paypal_config);

function createPaymentPayloadJson(senderEmailId, recipientEmailId, payoutAmount, trxnCurrnecy, uuid) {
    var webClientUrl = constants.webClientUrl;
    
    var payload = {
        senderEmail : senderEmailId,
        requestEnvelope: {
            errorLanguage:  'en_US'
        },
        actionType:     'PAY',
        currencyCode:   trxnCurrnecy,
        feesPayer:      'SENDER',
        memo:           'Chained payment example',
        cancelUrl:      webClientUrl + '/payment/paypalpaycancel?id=' + urlEncode(uuid),
        returnUrl:      webClientUrl + '/payment/paypalpaysuccess?id=' + urlEncode(uuid),
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

function prepareData(id, data, paymentStatus, operation){
    var paymentData;
    
    if(operation == 'create'){        
        paymentData = {'id': id,
                        'senderEmail': data.senderEmailId,
                        'recipientEmail': data.recipientEmailId,
                        'amount': data.amount,
                        'status' : paymentStatus,
                        'creator_id': data.creator_id
                    };
    }

    if(operation == 'save'){
        data.id = urlEncode.decode(data.id);

        paymentData = {'status' : paymentStatus,
                        'modifier_id': data.modifier_id
                    };
    }    

    return paymentData;
}

async function isValidPaymentTransaction(id, cb) {
    let err, rows, paymentTrxn;

    [err, rows] = await paymentTrxn_modelObj.getP(id);

    if(err) return cb('Payment transaction: ' + err);

    paymentTrxn = rows[0];

    var initiatedStatus = constants.paypalpaymentstatus.intiated;
    if(paymentTrxn.length == 0 || paymentTrxn[0].status != initiatedStatus) {
        return cb({ext:'Invalid Payment Transaction.'});
    }

    return cb(null, paymentTrxn);
}

async function addPaymentTransaction(id, data, cb) {
    let err, rows, paymentTrxn;    

    data = prepareData(id, data, 'create');

    [err, rows] = await paymentTrxn_modelObj.addP(data);
    data = rows[0];

    if(err) return cb('payment transaction: ' + data.id + ' : ' + err, null);

    paymentTrxn = [data];

    //Update Recipient's Wallet table

    return cb(null, paymentTrxn);
};

async function updatePaymentTransaction(data, cb) {
    let err, rows, paymentTrxn;

    data = prepareData(data.id, data, 'save');

    [err, rows] = await modelObj.updateP(data.id, data);
    data = rows[0];

    if(err) return cb('payment transaction: ' + data.id + ' : ' + err, null);

    paymentTrxn = [data];

    return cb(null, paymentTrxn);
};

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

router.get('/paypalpayments/:id?', function (req,res,next) {
    var out;
    var id = req.params.id;
    if(req.params.id){
        paymentTrxn_modelObj.get(id, function (err, rows) {
            if(err){
                console.log(err);
                out = {'error':true,'message':'Fetching Item details failed.','data':[err]};
            }else{
                out = {'error':false,'message':'Fetched item','data':rows};
            }
            return res.json(out);
        });
    }else{
        paymentTrxn_modelObj.getAll(function(err, rows){
            if (err) {
                console.log(err);
                out = {'error':true,'message':'Fetching failed','data':[]};
            }else{
                out = {'error':false,'message':'Fetched List','data':rows};
            }
            return res.json(out);
        });
    }
});

router.post('/pay', function(req, res){
    var out;
    var data = req.body;
    
    data.currency =  (data.hasOwnProperty('currency') ? data.currency : 'USD');

    var mandatoryFields = [data.senderEmailId, data.recipientEmailId, data.amount, data.creator_id];

    var isMandatoryOk = utils.checkMandatory(mandatoryFields);

    if(!isMandatoryOk){
        out = {'error':true,'message': 'Missing mandatory fields.','data':[]};

        return res.json(out);
    }

    var uuid = utils.getUniqueId();

    var payload_json = createPaymentPayloadJson(data.senderEmailId, data.recipientEmailId, data.amount, data.currency);
    
    paypal.pay(payload_json, function (err, response) {
        if (err) {
            out = {'error':true,'message':err, 'data': response};
        } else {
            //Add Payment Transaction details to PayPalPaymentTrxnLog table
            addPaymentTransaction(uuid, data, function (err, rows) {
                if(err){
                    out = {'error':true,'message':err,'data':[]};
                }else {
                    out = {'error':false,
                            'message':'Payment created successfully, waiting for approval.',
                            'uniqueId':uuid,
                            'data': rows[0]};
                }        
            });           
        }   
        
        return res.json(out);
    });        
});

router.post('/verifycustomer', function(req, res){
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

router.post('/payment/paypalpaymentcancel', function(req, res){
    var out;
    var data = req.body;
    
    var mandatoryFields = [data.id, data.modifier_id];

    var isMandatoryOk = utils.checkMandatory(mandatoryFields);

    if(!isMandatoryOk){
        out = {'error':true,'message': 'Missing mandatory fields.','data':[]};

        return res.json(out);
    }

    //Check the Status of the Payment Transaction Log and update as Cancel
    isValidPaymentTransaction(data.id, function (err, rows) {
        if(err){
            out = {'error':true,'message':err,'data':[]};
        }else {
            //Update Payment Transaction details in PayPalPaymentTrxnLog table
            updatePaymentTransaction(data, function (err, rows) {
                if(err){
                    out = {'error':true,'message':err,'data':[]};
                }else {
                    out = {'error':false,
                            'message':'Payment cancelled by the Sender.',
                            'data': rows[0]};
                }        
            });
        }        
    });

    //Return the response with Payment Cancel message.
    return res.json(out);
});

router.post('/payment/paypalpaymentsuccess', function(req, res){
    var out;

    var mandatoryFields = [data.id, data.modifier_id];

    var isMandatoryOk = utils.checkMandatory(mandatoryFields);

    if(!isMandatoryOk){
        out = {'error':true,'message': 'Missing mandatory fields.','data':[]};

        return res.json(out);
    }

    //Check the Status of the Payment Transaction Log and update as Cancel
    isValidPaymentTransaction(data.id, function (err, rows) {
        if(err){
            out = {'error':true,'message':err,'data':[]};
        }else {
            //Update Payment Transaction details in PayPalPaymentTrxnLog table
            updatePaymentTransaction(data, function (err, rows) {
                if(err){
                    out = {'error':true,'message':err,'data':[]};
                }else {
                    out = {'error':false,
                            'message':'Payment approved by the Sender successfully.',
                            'data': rows[0]};
                }        
            });
        }        
    });

    //Return the response with Payment approval message.
    return res.json(out);
});

module.exports = router;