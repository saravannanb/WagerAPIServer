 /**
 * Created by ssk on 01/Aug/19.
 */
'use strict';

var PaypalAdaptive = require('paypal-adaptive');
var urlEncode = require('urlencode');

var utils = require('../utils.js');
var constants = require('../../config/constants.js');
var paypal_config = require('../../paymentlib/paypal_config.js');
var paymentTrxn_modelObj = require('../../models/PayPalPaymentTrxnLog');

class PayPal {
    constructor() {
        this.paypal = new PaypalAdaptive(paypal_config);        
    }

    createPaymentPayloadJson(senderEmailId, recipientEmailId, payoutAmount, trxnCurrnecy, uuid) {
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
    
    createVerificationPayloadJson(emailId, firstName, lastName) {
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
    
    prepareData(id, data, paymentStatus, operation){
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

    async isValidPaymentTransaction(id, cb) {
        let err, rows, paymentTrxn;
    
        //Get the matching Payment Transaction
        [err, rows] = await paymentTrxn_modelObj.getP(id); 
    
        if(err) return cb('Payment transaction: ' + err);
    
        paymentTrxn = rows[0];
    
        var initiatedStatus = constants.paypalpaymentstatus.intiated;

        if(paymentTrxn.length == 0 || paymentTrxn[0].status != initiatedStatus) {
            return cb({ext:'Invalid Payment Transaction.'});
        }
    
        return cb(null, paymentTrxn);
    }

    async addPaymentTransaction(id, data, cb) {
        let err, rows, paymentTrxn;    
    
        data = this.prepareData(id, data, 'create');
    
        [err, rows] = await paymentTrxn_modelObj.addP(data);
        data = rows[0];
    
        if(err) return cb('payment transaction: ' + data.id + ' : ' + err, null);
    
        paymentTrxn = [data];
    
        //Update Recipient's Wallet table
    
        return cb(null, paymentTrxn);
    }
    
    async updatePaymentTransaction(data, cb) {
        let err, rows, paymentTrxn;
    
        data = this.prepareData(data.id, data, 'save');
    
        [err, rows] = await paymentTrxn_modelObj.updateP(data.id, data);
        data = rows[0];
    
        if(err) return cb('payment transaction: ' + data.id + ' : ' + err, null);
    
        paymentTrxn = [data];
    
        return cb(null, paymentTrxn);
    }

    getPaymentOptions() {
        var out;

        var payKey = 'AP-72B8086302014042D';

        var payload = {
            payKey: 'AP-72B8086302014042D',
            requestEnvelope: {
                detailLevel: 'ReturnAll',
                errorLanguage:  'en_US'
            }
        };

        this.paypal.getPaymentOptions(payload, function (err, response) {
            if (err) {
                out = {'error':true,'message':err,'data': response};
            } else {
                out = {'error':false,'message':'Payment made successfully','data': response};
            }

            console.log('out:- ', JSON.stringify(out))

            return JSON.stringify(out);
        });
    }

    async getPaymentTransaction(id) {
        let err, rows, paymentTrxn, out;

        if(id){
            [err, rows] = await paymentTrxn_modelObj.getP(id); 
            
            paymentTrxn = rows[0];
    
            if(err) {                
                out = {'error':true,
                    'message':'Fetching payment transaction details failed.','data':[err]};
                console.log(err);                
            }            
            else {
                out = {'error':false,
                    'message':'Fetched payment transaction details successfully.','data':paymentTrxn};
                console.log(out);                
            }

            return out;
            
        }else{
            [err, rows] = await paymentTrxn_modelObj.getAllP();
            
            paymentTrxn = rows[0];

            if(err) {                
                out = {'error':true,
                    'message':'Fetching payment transaction details failed.','data':[err]};
                console.log(err);                
            }            
            else {
                out = {'error':false,
                    'message':'Fetched payment transaction details successfully.','data':paymentTrxn};
                console.log(out);                
            }

            return out;
        }
    }
}

module.exports = PayPal;