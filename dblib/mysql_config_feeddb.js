/**
 * Created by gsmmgsm on 21/10/16.
 */
const url = require('url');

const protocol = 'mysql://';
const usrpwd = 'test:pwd1um*llai@';
//const host = '162.253.124.178';
const host = '%';
const port = ':3306';
const dbName = "/wagerfeeddb";

const connStrMySQL = protocol + usrpwd + '@' + host + port + dbName;
// 'mysql://test:pwd1um*llai@@localhost:3306/' + dbName;

//you need to parse the URL into a config object
const mysql_params = url.parse(connStrMySQL);//process.env.DATABASE_URL
const mysql_auth = mysql_params.auth.split(':');

const bluebird = require('bluebird');//for mysql promise
const db_config = {
    user: mysql_auth[0],
    password: mysql_auth[1],
    host: mysql_params.hostname,
    port: mysql_params.port,
    database: mysql_params.pathname.split('/')[1],
    ssl: false,
    Promise: bluebird
};

module.exports = db_config;