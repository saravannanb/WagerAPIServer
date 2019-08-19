/**
 * Created by ssk on 19/Aug/19.
 */
'use strict';

var braintreeModule = require("braintree");

var utils = require('../utils.js');
var constants = require('../../config/constants.js');
var braintree_config = require('../../paymentlib/braintree_config.js');

class BrainTree {
    constructor() {
        this.braintree = braintreeModule.connect(braintree_config);        
    }

    getClientToken(httpRes) {  
        return this.braintree.clientToken.generate({}, function(err, res) {
            if (err) {
                return httpRes.json({'error':true, 'message': err.message, 'data': []});
            } else {
                return httpRes.json({'error':false, 
                    'message': 'Client Token generated successfully.', 'data': res.clientToken});                
            }     
        });
    }

    addFund(data, httpRes) {     
        var saleData = {
            amount: data.amount,
            paymentMethodNonce: data.nonce,
            //orderId: "Mapped to PayPal Invoice Number",
            options: {
              submitForSettlement: true,
              paypal: {
                //customField: "PayPal custom field",
                description: "Add fund.",
              },
            }
        };

        return this.braintree.transaction.sale(saleData, function (err, transaction) {
            if (err) {
                return httpRes.json({'error':true, 'message': err.message, 'data': []});
            } else {
                return httpRes.json({'error':false, 
                    'message': 'Fund transfered successfully.', 'data': transaction});                
            }
          });
    }
}

module.exports = BrainTree;