 /**
 * Created by ssk on 12/Aug/19.
 */
'use strict';
var stripeConnectFunction = require("stripe-connect-functions") 
var stripe_config = require('../../paymentlib/stripe_config.js');

//const stripeConnet = new stripeConnectFunction(stripe_config.secretKey);

class StripeConnect {
    constructor() {
        this.stripeConnet =  stripeConnectFunction(stripe_config.secretKey);        
    }

    verifyAccount(customerId) {
        return this.stripeConnet.fetchCustomerCards(customerId);                               
    }
}

module.exports = StripeConnect;