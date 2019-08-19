/**
 * Created by gsmmgsm on 21/10/16.
 */
var moment = require('moment');
var nodemailer = require("nodemailer");
var host = 'localhost';//localhost 162.253.124.178
var port = '3003';//3010 3001
var serverUrl = 'http://' + host + ":" + port + "/";
var ext_host = 'localhost';
//var ext_host = '192.70.246.109'; //nodejs
//var ext_port = '3010';
var ext_port = '8080';
var passwordResetUrl = serverUrl + 'users/createpassword/';
var path = require('path');
var DEFAULT_COMPANY_ID = 1;
var EMAILMUST = 1;
var webClientUrl = 'http://localhost:8000'
var tables = {
    site_settings:'site_settings',
    roles: 'roles',
    users: 'users',
    login_history: 'login_history',
    companies: 'companies',
    qrcodes: 'qrcodes',
    categories: 'categories',
    subcat_items: 'subcat_items',
    items: 'items',
    item_times: 'item_times',
    combo_meal_items: 'combo_meal_items',
    meal_options: 'meal_options',
    meal_option_items: 'meal_option_items',
    orders: 'orders',
    order_items: 'order_items',
    paypal_payment_Trxn_Log: 'paypal_payment_Trxn_Log'
};
var mysqlDUPKEYRegex = /key\s'([^']+)/;//"Duplicate entry 'gsmmgsm@gmail.com' for key 'email'",
var mblRegex = /^\d{10}$/;
var emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
var SOURCE_ADMIN = 'admin';//working from admin panel.
var SOURCE_WEBAPP = 'webapp';//working from web client.
var SOURCE_ANDROID = 'android';//working from addroid client.
var SOURCE_IOS = 'ios';//working from ios client.
var TABLE_ID_STR = 'table_id';
var sources = {
    admin: SOURCE_ADMIN,
    webapp: SOURCE_WEBAPP,
    android: SOURCE_ANDROID,
    ios: SOURCE_IOS,
};
var rolelevels = {
    superlevel: 1,
    companylevel: 2,
    otherlevel: 3
};
var roles = {
    superadmin: 1,
    companyadmin: 2,
    companyuser: 3,
    otheruser: 4
};

var mailOptions = {
    from: '"GSM" <gsmmgsm@gmail.com>', // sender address
    to: 'foo@foo.com, zoo@zoo.com', // list of receivers
    subject: 'GSM: Password reset mail...', // Subject line
    text: '', // plain text body
    html: '' // html body
};
var smtpDetails = {
    host: 'smtp.gmail.com',//'smtpout.secureserver.net',//'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'gsmmgsm@gmail.com',
        pass: 'atleast!Cap1tal@'
    }
};
var paypalpaymentstatus = {
    intiated: 'INITIATED',
    paid: 'PAID',
    cancelled: 'CANCELLED'
};

// create mail transporter
var transporter = nodemailer.createTransport(smtpDetails);

var urlPathConstants = {
    all: 'all',
    active: 'active',
    inactive: 'inactive',
    pending: 'pending',
    opened: 'opened',
    closed: 'closed',
};
/*var smtpDetails = {
    host: 'smtp.gmail.com',//'smtp.gmail.com',
    port: 465,
    secure: false,
    auth: {
        user: 'gsmmgsm@gmail.com', // generated ethereal user
        pass: 'atleast!Cap1tal@'  // generated ethereal password
    }
};*/
var strings = {
    serverError: "There was an issue in connecting server. Try again later"
};

var userSlctFlds = 'select users.name, users.email, users.mobile, users.address, users.city, users.state, users.pincode, users.dob'
    + ', users.prfl_name, users.gndr, users.swdof, users.dl_name, users.dl_no, users.dl_type, users.dl_vld_upto, users.dl_isu_athrty, users.aadhaar_no'
    + ', users.remarks, users.role_id, users.isadmin, users.issuper,  users.status, users.isprflcmpltd'
    + ', users.company_id, users.source, users.ip, users.llsource, users.llip, users.lltime'
    + ', users.creator_id, users.modifier_id'
    + ', users.id, roles.rolelevel_id, rolelevels.name as rolelevel_name, roles.name as role_name';

var selectUserQry = userSlctFlds
    + ' from ' + tables.users
    + ' join roles on (users.role_id = roles.id)'
    + ' left join rolelevels on (roles.rolelevel_id = rolelevels.id)';

var selectUserQry_iph = userSlctFlds + ', password_hash'
    +  ' from ' + tables.users
    + ' join roles on (users.role_id = roles.id)'
    + ' left join rolelevels on (roles.rolelevel_id = rolelevels.id)'
    + ' where users.status=1 && roles.status=1 && rolelevels.status=1';

var loginHistorySlctFlds = userSlctFlds + ', ' + tables.login_history + '.id, '
    + tables.login_history + '.user_id, ' + tables.login_history + '.lgn_source, '
    + tables.login_history + '.lgn_ip, ' + tables.login_history + '.lgn_time';

var selectLoginHistoryQry = loginHistorySlctFlds
    + ' from ' + tables.login_history
    + ' join users on (' + tables.login_history + '.user_id = users.id)'
    + ' left join roles on (' + tables.users + '.role_id = roles.id)'
    + ' left join rolelevels on (' + tables.roles + '.rolelevel_id = rolelevels.id)';

//follow this order... which is used in User.js count:31flds (23common with update command)
//mdlObj.name, mdlObj.email, mdlObj.mobile, mdlObj.address, mdlObj.city, mdlObj.state, mdlObj.pincode, mdlObj.dob
// , mdlObj.prfl_name, mdlObj.gndr, mdlObj.swdof, mdlObj.dl_name, mdlObj.dl_no, mdlObj.dl_type, mdlObj.dl_vld_upto, mdlObj.dl_isu_athrty
// , mdlObj.aadhaar_no, mdlObj.remarks, mdlObj.role_id, mdlObj.isadmin, mdlObj.issuper, mdlObj.status, mdlObj.isprflcmpltd
// , mdlObj.company_id, mdlObj.source, mdlObj.ip, mdlObj.llsource, mdlObj.llip, mdlObj.lltime, mdlObj.creator_id, mdlObj.password_hash

var usrInsertFlds = ' (name, email, mobile, address, city, state, pincode, dob'
    + ', prfl_name, gndr, swdof, dl_name, dl_no, dl_type, dl_vld_upto, dl_isu_athrty'
    + ', aadhaar_no, remarks, role_id, isadmin, issuper, status, isprflcmpltd'
    + ', company_id, source, ip, llsource, llip, lltime, creator_id, password_hash)'
    + ' values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

var usrUpdtSetFlds = ' set name=?,email=?,mobile=?,address=?,city=?,state=?,pincode=?,dob=?'
    + ',prfl_name=?,gndr=?,swdof=?,dl_name=?,dl_no=?,dl_type=?,dl_vld_upto=?,dl_isu_athrty=?'
    + ',aadhaar_no=?,remarks=?,role_id=?,isadmin=?,issuper=?,status=?,isprflcmpltd=?';

var usrCmnPrflFlds = ' set prfl_name=?,email=?,mobile=?,address=?,city=?,state=?,pincode=?';

var usrCUPrflFlds = ' set dob=?,gndr=?,swdof=?,dl_name=?,dl_no=?,dl_type=?,dl_vld_upto=?,dl_isu_athrty=?,isprflcmpltd=?';
var dtVars = {
    dateRegexp: /^\d\d\d\d-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[1-2]\d|3[0-1])$/g,
    dtFrmt_YMD: 'YYYY-MM-DD',
    dtFrmt_YMDHms: 'YYYY-MM-DD HH:mm:ss'
};
module.exports = {
    images_path: path.join(__dirname+'../', 'public/images'),
    strings: strings,
    mthd_get: 'GET',
    mthd_post: 'POST',
    mthd_put: 'PUT',
    mthd_delete: 'DELETE',
    mthd_options: 'OPTIONS',
    host: host,
    port: port,
    ext_host: ext_host,
    ext_port: ext_port,
    passwordResetUrl: passwordResetUrl,
    webClientUrl: webClientUrl,
    DEFAULT_COMPANY_ID: DEFAULT_COMPANY_ID,
    EMAILMUST:EMAILMUST,
    rolelevels: rolelevels,
    roles: roles,
    mailOptions: mailOptions,
    smtpDetails: smtpDetails,
    transporter: transporter,
    sources: sources,
    paypalpaymentstatus: paypalpaymentstatus,
    mysqlDUPKEYRegex: mysqlDUPKEYRegex,
    mblRegex: mblRegex,
    emailRegex: emailRegex,
    TABLE_ID_STR: TABLE_ID_STR,
    moment: moment,
    dtVars: dtVars,
    urlPathConstants: urlPathConstants,
    tables: tables,
    query: {
        site_settings:{
            all: 'select * from ' + tables.site_settings,
            insert: 'insert into ' + tables.site_settings + ' (name, title, status) values (?,?,?);',
            get_by_id: 'select * from ' + tables.site_settings + ' where id=?',
            delete_by_id: 'update ' + tables.site_settings + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.site_settings + ' where id=?',
            update_by_id: 'update ' + tables.site_settings + ' set name=?,title=?,status=? where id=?',
            //updatelogo_by_id: 'update ' + tables.site_settings + ' set logo=?,modifier_id=? where id=?',
            updatelogo_by_id: 'update ' + tables.site_settings + ' set logo=? where id=?',
            //updatebanner_by_id: 'update ' + tables.site_settings + ' set banner=?,modifier_id=? where id=?',
            updatefavicon_by_id: 'update ' + tables.site_settings + ' set favicon=? where id=?'
        },
        roles:{
            all: 'select * from ' + tables.roles,
            insert: 'insert into ' + tables.roles + ' (name, rolelevel_id, status) values (?,?,?);',
            get_by_id: 'select * from ' + tables.roles + ' where id=?',
            delete_by_id: 'update ' + tables.roles + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.roles + ' where id=?',
            update_by_id: 'update ' + tables.roles + ' set name=?,rolelevel_id=?,status=? where id=?'
        },
        login_history:{
            all: selectLoginHistoryQry,
            insert: 'insert into ' + tables.login_history + '(user_id, lgn_source, lgn_ip, lgn_time) values(?,?,?,?)',
            all_by_user: selectLoginHistoryQry + ' where login_history.user_id = ?'
        },
        users:{
            insert: 'insert into ' + tables.users + usrInsertFlds,
            all: selectUserQry + ' where rolelevel_id != ' + rolelevels.superlevel,
            get_by_rest_user_only_rl2: selectUserQry + ' where users.id != ? and company_id=? and rolelevel_id = ' + rolelevels.companylevel,
            get_by_id: selectUserQry + ' where users.id=?',
            get_by_email: selectUserQry + ' where email=?',
            get_by_id_only_rl2: selectUserQry + ' where users.id=? and rolelevel_id = ' + rolelevels.companylevel,
            get_by_email_only_rl2: selectUserQry + ' where email=? and rolelevel_id = ' + rolelevels.companylevel,

            get_by_email_iph: selectUserQry_iph + ' && email=?',
            get_by_mobile_iph: selectUserQry_iph + ' && mobile=?',
            get_by_email_iph_only_rl2: selectUserQry_iph + ' && email=? and rolelevel_id = ' + rolelevels.companylevel,
            get_by_email_iph_exopusers: selectUserQry_iph + ' && email=? and rolelevel_id != ' + rolelevels.otherlevel,

            delete_by_id: 'update ' + tables.users + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.users + ' where id=?',
            update_by_id: 'update ' + tables.users + usrUpdtSetFlds + ',modifier_id=? where id=?',
            update_by_id_iph: 'update ' + tables.users + usrUpdtSetFlds + 'modifier_id=? password_hash=?,where id=?',
            update_cmnprfl_by_id: 'update ' + tables.users + usrCmnPrflFlds + ',modifier_id=? where id=?',
            update_cmnprfl_by_id_iph: 'update ' + tables.users + usrCmnPrflFlds + 'modifier_id=? password_hash=?,where id=?',
            update_cuprfl_by_id: 'update ' + tables.users + usrCUPrflFlds + ',modifier_id=? where id=?',
            update_cuprfl_by_id_iph: 'update ' + tables.users + usrCUPrflFlds + 'modifier_id=? password_hash=?,where id=?',
            update_res_by_id: 'update ' + tables.users + ' set company_id=?,modifier_id=? where id=?',
            update_pwd_by_email: 'update ' + tables.users + ' set password_hash=?,modifier_id=? where email=?',
            //updateimage_by_id: 'update ' + tables.users + ' set image=?,modifier_id=? where id=?',
            updateimage_by_id: 'update ' + tables.users + ' set image=? where id=?',
            updatelastlogin_by_id: 'update ' + tables.users + ' set llsource=?,llip=?,lltime=? where id=?'
        },
        companies:{
            all: 'select * from ' + tables.companies,
            insert: 'insert into ' + tables.companies + ' (name, description, website, email, mobile, address, remarks, cntct_prsn, cntct_prsn_mbl, pymntgtwy_user, pymntgtwy_key, posapi_name, posapi_key, status, creator_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
            get_by_id: 'select * from ' + tables.companies + ' where id=?',
            get_by_email: 'select * from ' + tables.companies + ' where email=?',
            delete_by_id: 'update ' + tables.companies + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.companies + ' where id=?',
            update_by_id: 'update ' + tables.companies + ' set name=?,description=?,website=?,email=?,mobile=?,address=?,remarks=?,cntct_prsn=?,cntct_prsn_mbl=?,pymntgtwy_user=?,pymntgtwy_key=?,posapi_name=?,posapi_key=?,status=?,modifier_id=? where id=?',
            //updatelogo_by_id: 'update ' + tables.companies + ' set logo=?,modifier_id=? where id=?',
            updatelogo_by_id: 'update ' + tables.companies + ' set logo=? where id=?',
            //updateimage_by_id: 'update ' + tables.companies + ' set banner=?,modifier_id=? where id=?',
            updateimage_by_id: 'update ' + tables.companies + ' set image=? where id=?',
            update_users_count: 'update ' + tables.companies + '  t1'
                + ' SET t1.users_count = (select COUNT(id) from (SELECT id FROM ' + tables.users + ' WHERE company_id=?) t2 ) '
                + ' ,t1.modifier_id=? WHERE t1.id=?'
        },
        qrcodes:{
            all: 'select * from ' + tables.qrcodes,
            insert: 'insert into ' + tables.qrcodes + ' (company_id, table_id, qrc_text, qrcode, description, status, creator_id) values (?,?,?,?,?,?,?);',
            get_by_id: 'select * from ' + tables.qrcodes + ' where id=?',
            all_by_company: 'select * from ' + tables.qrcodes + ' where company_id=?',
            get_by_company_table: 'select * from ' + tables.qrcodes + ' where company_id=? and table_id=?',
            delete_by_id: 'update ' + tables.qrcodes + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.qrcodes + ' where id=?',
            update_by_id: 'update ' + tables.qrcodes + ' set company_id=?,table_id=?,qrc_text=?,qrcode=?,description=?,status=?,modifier_id=? where id=?',
            //updateimage_by_id: 'update ' + tables.companies + ' set banner=?,modifier_id=? where id=?',
            updateimage_by_id: 'update ' + tables.qrcodes + ' set image=? where id=?'
        },
        categories:{
            all: 'select * from ' + tables.categories,
            insert: 'insert into ' + tables.categories + ' (company_id, name, description, parent_id, start, end, status, creator_id) values (?,?,?,?,?,?,?,?);',
            get_by_id: 'select * from ' + tables.categories + ' where id=?',
            all_by_company: 'select * from ' + tables.categories + ' where company_id=?',
            get_super_by_company: 'select * from ' + tables.categories + ' where parent_id = -1 and company_id=?',
            get_sub_by_company: 'select * from ' + tables.categories + ' where parent_id != -1 and company_id=?',
            get_sub_by_parent: 'select * from ' + tables.categories + ' where parent_id = ?',
            get_sub_by_company_parent: 'select * from ' + tables.categories + ' where parent_id=? and company_id=?',
            all_super_by_company: 'select * from ' + tables.categories + ' where parent_id = -1 and company_id=?',
            all_sub_by_company: 'select * from ' + tables.categories + ' where parent_id != -1 and company_id=?',
            delete_by_id: 'update ' + tables.categories + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.categories + ' where id=?',
            update_by_id: 'update ' + tables.categories + ' set company_id=?,name=?,description=?,parent_id=?,start=?,end=?,status=?,modifier_id=? where id=?',
            update_sc_count: 'update ' + tables.categories + '  t1'
                + ' SET t1.sc_count = (select COUNT(id) from (SELECT id FROM ' + tables.categories + ' WHERE parent_id=?) t2 ) '
                + ' ,t1.modifier_id=? WHERE t1.id=?'
        },
        items:{//id, category_id, name, price, company_id, description, image, stock, status
            all: 'select * from ' + tables.items,
            all_by_company: 'select * from ' + tables.items + ' where company_id=? ',
            all_simple: 'select * from ' + tables.items + ' where type = "simple" ',
            all_simple_by_company: 'select * from ' + tables.items + ' where type = "simple"  and company_id=? ',
            all_non_simple_by_company: 'select * from ' + tables.items + ' where type != "simple"  and company_id=? ',
            insert: 'insert into ' + tables.items + ' (company_id, type, name, description, price, image, status, stock, creator_id) values (?,?,?,?,?,?,?,?,?);',
            get_by_id: 'select items.*, rest_tbl.name as company_name, rest_tbl.description as company_description'
                + ' from ' + tables.items
                + ' join companies as rest_tbl on (items.company_id = rest_tbl.id)'
                + ' where items.id=?',
            delete_by_id: 'update ' + tables.items + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.items + ' where id=?',
            update_by_id: 'update ' + tables.items + ' set company_id=?,type=?,name=?,description=?,price=?,image=?,status=?,stock=?,modifier_id=? where id=?',
            //updateimage_by_id: 'update ' + tables.items + ' set image=?,modifier_id=? where id=?',
            updateimage_by_id: 'update ' + tables.items + ' set image=? where id=?'
        },
        subcat_items:{
            all: 'select * from ' + tables.subcat_items,
            all_by_master: 'select subcat_items.*'
                + ', items.name as item_name, items.description as item_description, items.type as item_type'
                + ', items.price as item_price, items.image as item_image, items.stock as item_stock, items.status as item_status'
                + ', prnt_cat_tbl.id parentcatid, prnt_cat_tbl.name parentcat'
                + ', sub_cat_tbl.id subcatid, sub_cat_tbl.name as subcat'
                + ' from ' + tables.subcat_items
                + ' join items on (subcat_items.item_id = items.id)'
                + ' join categories as sub_cat_tbl on (subcat_items.master_id = sub_cat_tbl.id)'
                + ' left join categories as prnt_cat_tbl on (sub_cat_tbl.parent_id = prnt_cat_tbl.id)'
                + ' where master_id in (#0)',
            all_by_parentcat_company: 'select rest_tbl.name as company_name, rest_tbl.description as company_description'
                + ', items.name as item_name, items.description as item_description, items.type as item_type'
                + ', items.price as item_price, items.image as item_image, items.stock as item_stock, items.status as item_status'
                + ', prnt_cat_tbl.name parentcat, prnt_cat_tbl.id parentcatid, prnt_cat_tbl.company_id'
                + ', sub_cat_tbl.name subcat, sub_cat_tbl.id subcatid'
                + ', subcat_items.* from ' + tables.subcat_items
                + ' join items on (subcat_items.item_id = items.id)'
                + ' join categories as sub_cat_tbl on (subcat_items.master_id = sub_cat_tbl.id)'
                + ' left join categories as prnt_cat_tbl on (sub_cat_tbl.parent_id = prnt_cat_tbl.id)'
                + ' left join companies as rest_tbl on (prnt_cat_tbl.company_id = rest_tbl.id)'
                + ' where prnt_cat_tbl.company_id=? '
                + ' and prnt_cat_tbl.id in (select id from categories where parent_id = -1 and company_id =? #and_parent_cat_id)',
            get_by_id: 'select * from ' + tables.subcat_items + ' where id=?',
            insert: 'insert into ' + tables.subcat_items + ' (master_id, item_id, price, status, creator_id) values (?,?,?,?,?);',
            insertMultiple: 'insert into ' + tables.subcat_items + ' (master_id, item_id, price, status, creator_id) values ',
            delete_by_id: 'update ' + tables.subcat_items + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.subcat_items + ' where id=?',
            truncate: 'delete from ' + tables.subcat_items + ' where #whrfld in (#0)',
            update_by_id: 'update ' + tables.subcat_items + ' set item_id=?,price=?,status=?,modifier_id=? where id=?'
        },
        combo_meal_items:{
            all: 'select * from ' + tables.combo_meal_items,
            all_by_master: 'select combo_meal_items.*, items.name as item_name from ' + tables.combo_meal_items
                + ' join items on (combo_meal_items.item_id = items.id) where master_id in (#0) and master_type=?',
            insert: 'insert into ' + tables.combo_meal_items + ' (master_id, master_type, item_id, price, status, creator_id) values (?,?,?,?,?);',
            insertMultiple: 'insert into ' + tables.combo_meal_items + ' (master_id, master_type, item_id, price, status, creator_id) values ',
            get_by_id: 'select * from ' + tables.combo_meal_items + ' where id=?',
            delete_by_id: 'update ' + tables.combo_meal_items + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.combo_meal_items + ' where id=?',
            truncate: 'delete from ' + tables.combo_meal_items + ' where #whrfld in (#0)',
            update_by_id: 'update ' + tables.combo_meal_items + ' set item_id=?,price=?,status=?,modifier_id=? where id=?'
        },
        meal_options:{
            all: 'select * from ' + tables.meal_options,
            all_by_master: 'select * from ' + tables.meal_options + ' where master_id in (#0)',
            insert: 'insert into ' + tables.meal_options + ' (master_id, name, isrqrd, lmtofchoice, status, creator_id) values (?,?,?,?,?,?);',
            insertMultiple: 'insert into ' + tables.meal_options + ' (master_id, name, isrqrd, lmtofchoice, status, creator_id) values ',
            get_by_id: 'select * from ' + tables.meal_options + ' where id=?',
            delete_by_id: 'update ' + tables.meal_options + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.meal_options + ' where id=?',
            truncate: 'delete from ' + tables.meal_options + ' where #whrfld in (#0)',
            update_by_id: 'update ' + tables.meal_options + ' set name=?,isrqrd=?,lmtofchoice=?,status=?,modifier_id=? where id=?'
        },
        orders:{
            all: 'select * from ' + tables.orders,
            insert: 'insert into ' + tables.orders
                + ' (orderid, user_id, order_source, company_id, table_id, qr_id, odate, order_status'
                + ', ovalue, tax_prcnt, tax_amnt, total_amnt'
                + ', dscnt_amnt, dscnt_code, pymnt_amnt, pymnt_status'
                + ', pymnt_mode, pymnt_card_dtls, spl_ins, status, creator_id)'
                + ' values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            get_by_id: 'select orders.*, rest_tbl.name as company_name, users.name as user_name from '
                + tables.orders
                + ' join companies as rest_tbl on (orders.company_id = rest_tbl.id)'
                + ' join users on (orders.user_id = users.id)'
                + ' where orders.id=?',
            all_by_user: 'select * from ' + tables.orders + ' where user_id=?',
            all_by_company: 'select * from ' + tables.orders + ' where company_id=?',
            delete_by_id: 'update ' + tables.orders + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.orders + ' where id=?',
            update_by_id: 'update ' + tables.orders
                + ' set order_status=?'
                + ',ovalue=?,tax_prcnt=?,tax_amnt=?,total_amnt=?'
                + ',dscnt_amnt=?,dscnt_code=?,pymnt_amnt=?,pymnt_status=?'
                + ',pymnt_mode=?,pymnt_card_dtls=?,spl_ins=?,status=?,modifier_id=? where id=?',
            update_ovalue: 'update ' + tables.orders + '  t1'
                + ' SET t1.ovalue = (SELECT SUM(price) FROM order_items t2 WHERE t2.master_id=?) '
                + ' ,t1.modifier_id=? WHERE t1.id=?'
        },
        order_items:{
            all: 'select * from ' + tables.order_items,
            all_by_master: 'select order_items.*, items.name as item_name, items.type as item_type,'
                + ' (order_items.quantity * order_items.price) as liprice  from ' + tables.order_items
                + ' join items on (order_items.item_id = items.id) where master_id in (#0)',
            insert: 'insert into ' + tables.order_items + ' (master_id, item_id, slctd_mo_cmi_ids, quantity, price, status, creator_id) values (?,?,?,?,?,?,?);',
            insertMultiple: 'insert into ' + tables.order_items + ' (master_id, item_id, slctd_mo_cmi_ids, quantity, price, status, creator_id) values ',
            get_by_id: 'select * from ' + tables.order_items + ' where id=?',
            delete_by_id: 'update ' + tables.order_items + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.order_items + ' where id=?',
            truncate: 'delete from ' + tables.order_items + ' where #whrfld in (#0)',
            update_by_id: 'update ' + tables.order_items + ' set item_id=?,slctd_mo_cmi_ids=?,quantity=?,price=?,status=?,modifier_id=? where id=?'
        },
        item_times:{
            all: 'select * from ' + tables.item_times,
            all_by_master: 'select * from ' + tables.item_times + ' where master_id in (#0)',
            insert: 'insert into ' + tables.item_times + ' (master_id, start, end, status, creator_id) values (?,?,?,?,?);',
            insertMultiple: 'insert into ' + tables.item_times + ' (master_id, start, end, status, creator_id) values ',
            get_by_id: 'select * from ' + tables.item_times + ' where id=?',
            delete_by_id: 'update ' + tables.item_times + ' set status=-1 where id=?',
            delete_by_id_1: 'delete from ' + tables.item_times + ' where id=?',
            truncate: 'delete from ' + tables.item_times + ' where #whrfld in (#0)',
            update_by_id: 'update ' + tables.item_times + ' set start=?,end=?,status=?,modifier_id=? where id=?'
        },
        paypal_payment_txn_log:{
            all: 'select * from ' + tables.paypalpaymentTrxnLog,
            insert: 'insert into ' + tables.paypalpaymentTrxnLog + ' (id, sender_email, recipient_email, amount, status, created_id) values (?,?,?,?,?,?);',
            get_by_id: 'select * from ' + tables.paypalpaymentTrxnLog + ' where id=?',
            update_by_id: 'update ' + tables.paypalpaymentTrxnLog + ' set status=?, modified_id=? where id=?'
        }
    }
};