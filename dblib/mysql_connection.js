/**
 * Created by gsmmgsm on 21/10/16.
 */
var db_config = require('./mysql_config');

/*
 //MySQL2 use default Promise object available in scope. But you can choose which Promise implementation you want to use
 //sample code
 //https://github.com/sidorares/node-mysql2/tree/master/documentation
 //https://github.com/sidorares/node-mysql2/blob/master/documentation/Examples.md

 //Method 1 using bluebird
 // get the client
 const mysql = require('mysql2/promise');

 // get the promise implementation, we will use bluebird
 const bluebird = require('bluebird');

 // create the connection, specify bluebird as Promise
 const connection =  mysql.createConnection({host:'localhost', user: 'root', database: 'test', Promise: bluebird});

 // query database
 const [rows, fields] =  connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);

 //Method 2

 async function main() {
 // get the client
 const  mysql = require('mysql2/promise');
 // create the connection
 const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'test'});
 // query database
 const [rows, fields] = await connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);
 }


 */

//const mysql = require('mysql');
const mysql = require('mysql2'); //compatible with the above mysql and async supports --

/*var DBConn = mysql.createConnection(db_config);
DBConn.on('error', function(err) {
    console.log("[mysql error:DBConn]",err);
});*/

var DBPool = mysql.createPool(db_config);
DBPool.on('error', function(err) {
    console.log("[mysql error:DBPool]",err);
});

//promised
const  mysqlPromise = require('mysql2/promise'); //if you want use async/wait in your code you can use this mysql [which is promise]

/*const DBConnPromise =  mysqlPromise.createConnection(db_config);
DBConnPromise.on('error', function(err) {
    console.log("[mysql error:DBConnPromise]",err);
});*/

const DBPoolPromise =  mysqlPromise.createPool(db_config);
DBPoolPromise.on('error', function(err) {
    console.log("[mysql error:DBPoolPromise]",err);
});

//var DB = DBConn;
var DB = DBPool;

//var DBPromise = DBConnPromise;
var DBPromise = DBPoolPromise;

function getConnection(){
    var tmp = mysql.createConnection(db_config);
    tmp.on('error', function(err) {
        console.log("[mysql error:DBConn for txn]",err);
    });
    return tmp;
}
module.exports = {
    DB,
    DBPromise,
    getConnection
};