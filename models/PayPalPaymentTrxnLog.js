/**
 * Created by SSK on 17/Aug/2019.
 */
var mysql=require('../dblib/mysql_connection');
var dbPromise = mysql.DBPromise;
var db = mysql.DB;

var constants = require('../config/constants.js');

var ModelObject={
    getDB(){return db;},
    getDBPromis(){return dbPromise;},
    getDBConnForTxn(){return mysql.getConnection();},
    getAll:function(callback){
        return db.execute(constants.query.paypal_payment_txn_log.all, callback);
    },
    getAllP:function(callback){
        return dbPromise.execute(constants.query.paypal_payment_txn_log.all);
    },
    get:function(id, callback){
        return db.execute(constants.query.paypal_payment_txn_log.get_by_id
         ,[id]
         ,callback);
    },
    getP:function(id, callback){
        // query database
        return dbPromise.execute(constants.query.paypal_payment_txn_log.get_by_id, [id]);
    },
    add:function(mdlObj, callback){
        var values = [mdlObj.id, mdlObj.senderEmail, mdlObj.recipientEmail, mdlObj.amount, 
                        mdlObj.status, mdlObj.creator_id];
        return db.execute(constants.query.paypal_payment_txn_log.insert
            ,values
            ,callback);
    },
    addP:function(mdlObj, callback){
        var values = [mdlObj.id, mdlObj.senderEmail, mdlObj.recipientEmail, mdlObj.amount, 
            mdlObj.status, mdlObj.creator_id];
        return dbPromise.execute(constants.query.paypal_payment_txn_log.insert, values);
    },
    update:function(id, mdlObj, callback){
        var values = [mdlObj.status, mdlObj.modifier_id, id];
        return  db.execute(constants.query.paypal_payment_txn_log.update_by_id
            ,values
            ,callback);
    },
    updateP:function(id, mdlObj, callback){
        var values = [mdlObj.status, mdlObj.modifier_id, id];
        return dbPromise.execute(constants.query.paypal_payment_txn_log.update_by_id, values);
    }
};

module.exports = ModelObject;