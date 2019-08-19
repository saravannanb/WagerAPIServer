/**
 * Created by gsmmgsm on 21/10/16.
 */
/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var crypto = require('crypto');
const nodemailer = require('nodemailer');
var constants = require('../config/constants.js');
const uuidv4 = require('uuid/v4');

var salt_length = 29;
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};
/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};
var saltHashPassword = function saltHashPassword(password) {
    var salt = genRandomString(salt_length); /** Gives us salt of length salt_length */
    var passwordData = sha512(password, salt);
    // console.log('UserPassword = '+password);
    // console.log('Passwordhash = '+passwordData.passwordHash);
    // console.log('nSalt = '+passwordData.salt);
    return (salt + '$' + passwordData.passwordHash);
};
var checkMandatory = function (fields) {
    var isOk = true;
    fields.forEach(function(field){
        var isnumeric = (typeof field == "number" && !isNaN(field));
        if(!isnumeric && (!field || field.trim().length == 0)){
            isOk = false;
        }
    });
    return isOk;
};
var checkHashPassword = function checkHashPassword(passwordHash, password) {
    var salt = (passwordHash+"").substr(0, salt_length);
    var passwordData = sha512(password, salt);
    return passwordHash === (salt + '$' + passwordData.passwordHash);
};
var prepareUserForCP = function prepareUserForCP(data){

    var mandatoryFields = [data.email,data.password];
    var isMandatoryOk = checkMandatory(mandatoryFields);

    if(!isMandatoryOk){
        return isMandatoryOk;
    }else{
        var password_hash = saltHashPassword(data.password);
        data.password_hash = password_hash;
        return data;
    }

};
var setHashPassword = function(data){
    var password_hash = saltHashPassword(data.password);
    data.password_hash = password_hash;
    return;
};
var prepareCompany = function prepareCompany(data){
    data.role_id = constants.roles.companyadmin;
    var mandatoryFields = [data.name,data.description,data.website,data.email,data.mobile,data.password
        ,data.role_id,data.creator_id,data.source, data.pymntgtwy_user, data.pymntgtwy_key, data.posapi_name, data.posapi_key];
    var isMandatoryOk = checkMandatory(mandatoryFields);

    if(!isMandatoryOk){
        return isMandatoryOk;
    }else{
        //hasOwnProperty than podanum....
        data.cntct_prsn =  (data.hasOwnProperty('cntct_prsn')?data.cntct_prsn:'');
        data.cntct_prsn_mbl =  (data.hasOwnProperty('cntct_prsn_mbl')?data.cntct_prsn_mbl:'');
        data.address =  (data.hasOwnProperty('address')?data.address:'');
        data.city =  (data.hasOwnProperty('city')?data.city:'');
        data.state =  (data.hasOwnProperty('state')?data.state:'');
        data.pincode =  (data.hasOwnProperty('pincode')?data.pincode:'');
        return data;
    }
};
var prepareUser = function prepareUser(data, onCompanyCreation = false){

    data.company_id =  (data.hasOwnProperty('company_id')?data.company_id:-1);

    if(data.company_id > 0){
        //by default company non-admin user for empty role.
        data.role_id =  (data.hasOwnProperty('role_id')?data.role_id:constants.roles.companyuser);
    }else{
        //by default other user
        data.role_id = (data.hasOwnProperty('role_id')?data.role_id:constants.roles.otheruser);
        data.role_id = ((data.role_id != constants.roles.companyuser
            &&  data.role_id != constants.roles.otheruser)?constants.roles.otheruser:data.role_id);
        //data.role_id = (onCompanyCreation?(data.hasOwnProperty('role_id')?data.role_id:constants.roles.otheruser):constants.roles.otheruser);
    }
    if(!data.hasOwnProperty('creator_id')){
        data.creator_id = -1;
    }
    var mandatoryFields = [data.name,data.mobile,data.role_id,data.creator_id];
    if((onCompanyCreation || data.company_id > 0) && constants.EMAILMUST) {
        mandatoryFields.push(data.email);
    }
    if(!(data.id>0) || data.editPassword) {
        mandatoryFields.push(data.password);
    }
    if(data.role_id != constants.roles.superadmin){
        data.source = (data.hasOwnProperty('source')?data.source:'webapp');
        mandatoryFields.push(data.source);
    }
    /*if(data.rolelevel_id != constants.rolelevels.superlevel){
        mandatoryFields.push(data.source);
    }*/
    var isMandatoryOk = checkMandatory(mandatoryFields);

    if(!isMandatoryOk){
        return isMandatoryOk;
    }else{
        if(!(data.id>0) || data.editPassword) {
            var password_hash = saltHashPassword(data.password);
            data.password_hash = password_hash;
        }
        data.issuper = ((data.role_id == constants.roles.superadmin)?1:0);
        data.isadmin = ((data.role_id == constants.roles.companyadmin)?1:0);

        data.ip =  (data.hasOwnProperty('ip')?data.ip:null);
        data.email =  (data.hasOwnProperty('email')?data.email:'');
        data.address =  (data.hasOwnProperty('address')?data.address:'');
        data.city =  (data.hasOwnProperty('city')?data.city:'');
        data.state =  (data.hasOwnProperty('state')?data.state:'');
        data.pincode =  (data.hasOwnProperty('pincode')?data.pincode:'');
        data.dob =  (data.hasOwnProperty('dob')?data.dob:'');
        data.prfl_name =  (data.hasOwnProperty('prfl_name')?data.prfl_name:data.name);
        data.gndr =  (data.hasOwnProperty('gndr')?data.gndr:'');
        data.swdof =  (data.hasOwnProperty('swdof')?data.swdof:'');
        data.dl_name =  (data.hasOwnProperty('dl_name')?data.dl_name:'');
        data.dl_no =  (data.hasOwnProperty('dl_no')?data.dl_no:'');
        data.dl_type =  (data.hasOwnProperty('dl_type')?data.dl_type:'');
        data.dl_vld_upto =  (data.hasOwnProperty('dl_vld_upto')?data.dl_vld_upto:'');
        data.dl_isu_athrty =  (data.hasOwnProperty('dl_isu_athrty')?data.dl_isu_athrty:'');
        data.aadhaar_no =  (data.hasOwnProperty('aadhaar_no')?data.aadhaar_no:'');
        data.remarks =  (data.hasOwnProperty('remarks')?data.remarks:'');
        data.status =  (data.hasOwnProperty('status')?data.status:1);
        data.llsource =  (data.hasOwnProperty('llsource')?data.llsource:null);
        data.llip =  (data.hasOwnProperty('llip')?data.llip:null);
        data.lltime =  (data.hasOwnProperty('lltime')?data.lltime:null);

        var validDob = ((data.dob != "")?data.dob.match(constants.dateRegexp):null);
        var validUpto = ((data.dl_vld_upto!= "")?data.dl_vld_upto.match(constants.dateRegexp):null);
        if(data.gndr != "" && data.swdof != "" && data.dl_name != ""
            && data.dl_no != "" && data.dl_type != "" && data.dl_isu_athrty != ""
            && validDob != null && validUpto != null){
            data.isprflcmpltd = 1;
        }else{
            data.isprflcmpltd =  (data.hasOwnProperty('isprflcmpltd')?data.isprflcmpltd:0);
        }
        return data;
    }
};
var validateID = function validateID(next, paramID){
    var objId;
    try {
        objId = ObjectId( paramID );
    } catch (err) {
        return false;
    }
    return objId;
};
var sendMailFPLink = function sendMailFPLink(tomailid, callback){

    var transporter = constants.transporter;
    var mo = constants.mailOptions;
    mo.to = tomailid;
    var content = 'Please follow the link ' + constants.passwordResetUrl + tomailid + '/akdfjsadsadf';
    mo.text = content;
    mo.html = '<b>' + content + '</b>';
    transporter.sendMail(mo, function(error, info){
        if (error) {
            console.log(error);
        }else{
            console.log('Message sent: %s', info.messageId);
        }
        callback(error, info);
        return;
    });

};
// to.js
function to(promise) {
    return promise
        .then(data => {
        return [null, data];
})
.catch(err => [err]);
}
function removePwdFields(data){
    delete data.editPassword;
    delete data.password;
    delete data.cpassword;
    delete data.password_hash;
}

var getUniqueId = function () {
    var uuid = uuidv4(); //generated random UUID
    return uuid;
};

module.exports = {
    validateID: validateID,
    checkMandatory : checkMandatory,
    genRandomString : genRandomString,
    saltHashPassword: saltHashPassword,
    checkHashPassword: checkHashPassword,
    prepareUser: prepareUser,
    prepareUserForCP: prepareUserForCP,
    prepareCompany: prepareCompany,
    removePwdFields: removePwdFields,
    sendMailFPLink: sendMailFPLink,
    setHashPassword: setHashPassword,
    to: to,
    getUniqueId: getUniqueId
};