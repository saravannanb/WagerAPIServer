 /**
 * Created by ssk on 12/Aug/19.
 */
'use strict';
var stripe = require('stripe'); 
var OAuth = require('oauth')

var stripe_config = require('../../paymentlib/stripe_config.js');
var utils = require('../utils.js');

//const stripeConnet = new stripeConnectFunction(stripe_config.secretKey);

class Stripe {
    constructor() {
        this.stripe = stripe(stripe_config.secretKey);        
    }

    getAccessToken() {
        var OAuth2 = OAuth.OAuth2;    
        var client_id = stripe_config.client_id;
        var secret = stripe_config.secretKey;
        var oauth2 = new OAuth2(client_id, secret, stripe_config.stripeServerBaseUrl, 
            null, 'oauth/token', null);        

        //ac_******************
        oauth2.getOAuthAccessToken(
            '', 
            {'grant_type':'authorization_code'},
            function (e, access_token, refresh_token, results){
            console.log('bearer: ',e);
        });
    }

    verifyCustomerBankAccount(data) {
        var data = {amounts: [32,45]}
        
        this.stripe.customers.verifySource(data.customerId, data.bankAccountId,
            {
                amounts: [32, 45],
            },
            function(err, bankAccount) {
                if(err) {
                    throw new Error(err);
                }
                console.log('Bank account:- ', JSON.stringify(bankAccount));

                return bankAccount;
            }
        );
    }

    verifyCustomer(customerId) {
        return this.stripe.customers.retrieve(customerId);                               
    }

    async getDestinationUserId(recipientFirstName, recipientLastName) {
        return await this.stripe.tokens.create({
            account: {
              individual: {
                first_name: recipientFirstName,
                last_name: recipientLastName,
              },
              tos_shown_and_accepted: true,
            },
        });
    }    

    createSenderAccountCharge(senderCustomerId, recipientCustomerId, chargeAmount, 
        currency, transferGroupId, balTransactionId) {
            
            return this.stripe.charges.create({
                amount: (parseFloat(chargeAmount).toFixed(2) * 100),
                currency: currency,
                customer: senderCustomerId,
                // balance_transaction: balTransactionId,
                description: 'Charge for ' + recipientCustomerId,
                transfer_group: transferGroupId,
              });
    }

    createReciepientAccountTransfer(recipientUserId, senderCustomerId, transferAmount, 
        currency, transferGroupId, balTransactionId) {
            return this.stripe.transfers.create({
                amount: (parseFloat(transferAmount).toFixed(2) * 100),
                currency: currency,
                //balance_transaction: balTransactionId,
                destination: recipientUserId,   
                description: 'Transfer from ' + senderCustomerId,             
                transfer_group: transferGroupId,
              });
    }

    createReciepientAccountPayment(recipientCustomerId, senderCustomerId, transferAmount, 
        currency, transferGroupId) {
            return this.stripe.paymentIntents.create({
                amount: (parseFloat(transferAmount).toFixed(2) * 100),
                currency: currency,
                customer: recipientCustomerId,
                confirm: true,   
                capture_method: 'automatic', 
                description: 'Transfer from ' + senderCustomerId,             
                transfer_group: transferGroupId,
              });
    }

    transferFund(data) {
        var transferGroupId = utils.getUniqueId();
        var balTransactionId = utils.getUniqueId();
        
        data.currency =  (data.hasOwnProperty('currency') ? data.currency : 'USD');

        var mandatoryFields = [data.senderCustomerId, data.recipientCustomerId, data.amount];

        var isMandatoryOk = utils.checkMandatory(mandatoryFields);

        if(!isMandatoryOk) {         
            throw new Error('Missing mandatory fields.');
        }

        return this.createSenderAccountCharge(data.senderCustomerId, data.recipientCustomerId, 
            data.amount, data.currency, transferGroupId, balTransactionId)
            .then(charge => {
                console.log(JSON.stringify(charge));
                /*
                return this.createReciepientAccountPayment(data.recipientCustomerId, 
                    data.senderCustomerId, data.amount, data.currency, transferGroupId);
                */
                return this.createReciepientAccountTransfer('acct_1F83PQBdiJPNOymj', 
                data.senderCustomerId, data.amount, data.currency, transferGroupId, balTransactionId);
                
            });            
    }
}

module.exports = Stripe;