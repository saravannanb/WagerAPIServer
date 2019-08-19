 /**
 * Created by ssk on 19/Aug/19.
 */

var braintree = require("braintree");

 const payment_config = {
    environment: braintree.Environment.Sandbox,
    merchantId: 'sdp92dkp2wsm6f2v',
    publicKey: '4fhhb8h2cm9p772c',
    privateKey: '968bb40c28aaac5ddc8b49355da2b6cf'
 }

 module.exports = payment_config;