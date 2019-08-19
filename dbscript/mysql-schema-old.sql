CREATE USER 'test'@'localhost' IDENTIFIED BY 'pwd1um*llai@';
CREATE USER 'test'@'%' IDENTIFIED BY 'pwd1um*llai@';
CREATE DATABASE /*!32312 IF NOT EXISTS*/`restaurant` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
GRANT ALL ON *.* to 'test'@'localhost';
GRANT ALL ON *.* to 'test'@'%';
USE `restaurant`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE, TIME_ZONE='+05:30' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*!40014 SET @OLD_SQL_SAFE_UPDATES=@@SQL_SAFE_UPDATES, SQL_SAFE_UPDATES=0 */;
/*!40101 SET NAMES utf8 */;
-- SET TIME_ZONE='+00:00' //gsm ??


CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128),
  `title` varchar(128) NOT NULL,
  `logo` varchar(128),
  `favicon` varchar(128),
  `status` int(1) NOT NULL DEFAULT '1',
  `email` varchar(40),
  `mobile` varchar(20),
  `address` varchar(512),
  `creator_id` int(11) NOT NULL DEFAULT '-1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
INSERT INTO site_settings (id, name, title) VALUES
 (1, 'Admin Panel', 'Admin Panel');

CREATE TABLE IF NOT EXISTS `rolelevels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
INSERT INTO rolelevels (id, name, status) VALUES
 (1, 'SuperLevel', 1),
 (2, 'CompanyLevel', 1),
 (3, 'OtherLevel', 1);

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `rolelevel_id` int(11) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`name`),
  KEY (`rolelevel_id`),
  FOREIGN KEY (`rolelevel_id`) REFERENCES `rolelevels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
INSERT INTO roles (id, name, rolelevel_id, status) VALUES
 (1, 'SuperAdmin', 1,1),
 (2, 'CompanyAdmin', 2,1),
 (3, 'CompanyUser', 2,1),
 (4, 'OtherUser', 3,1);

--
-- Table structure for table `users`
--
-- {"name":"Yogesh","mobile":"9894453479","gmail":"testgsm@gmail.com","source":"android","password":"allothers","ip":"278.990.12.8"}
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `email` varchar(40),
  `mobile` varchar(20) NOT NULL,
  `address` varchar(512),
  `city` varchar(32),
  `state` varchar(32),
  `pincode` varchar(16),
  `dob` date,
  `prfl_name` varchar(128),
  `gndr` int(1) NOT NULL DEFAULT '0',
  `swdof` varchar(128) COMMENT 'Parent or Guardian Name',
  `dl_name` varchar(128),
  `dl_no` varchar(32),
  `dl_type` varchar(32),
  `dl_vld_upto` date,
  `dl_isu_athrty` varchar(32),
  `aadhaar_no` varchar(32),
  `remarks` varchar(512),
  `isadmin` int(1) NOT NULL DEFAULT '0',
  `issuper` int(1) NOT NULL DEFAULT '0',
  `llsource` varchar(16) COMMENT 'from where last login happened',
  `llip` varchar(32) COMMENT 'last login ip',
  `lltime` DATETIME COMMENT 'last login time',
  `source` varchar(16) COMMENT 'admin, webapp, android, ios',
  `ip` varchar(32) COMMENT 'created from ip',
  `image` varchar(128) NOT NULL  DEFAULT '',
  `password_hash` varchar(256) NOT NULL,
  `role_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL DEFAULT '-1',
  `status` int(1) NOT NULL DEFAULT '1',
  `isprflcmpltd` int(1) NOT NULL DEFAULT '0',
  `creator_id` int(11) NOT NULL DEFAULT '-1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`mobile`),
  KEY (`role_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 INSERT INTO users (id, name, email, mobile, password_hash, role_id, issuper, status) VALUES
 (1, 'Gsm', 'gsmmgsm@gmail.com', '8667274425'
 , 'f361d6092844aac44b8306f83fc39$ab219ab9f1352285252ea51f9dcbaac7f4fc681fde3cd483915b86730b3710b38dcc150e6655e1fd32482ad38034b0ba212e8397ac79baf32d92e7718c8256e3'
 ,1,1,1);

--
-- Table structure for table `login_history`
--

CREATE TABLE IF NOT EXISTS `login_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `lgn_source` varchar(16) COMMENT 'from where last login happened',
  `lgn_ip` varchar(32) COMMENT 'last login ip',
  `lgn_time` DATETIME COMMENT 'last login time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `companies`
--
-- {"email":"anbagam@anbagam.com","password":"test1234","name":"anbagam","website":"anbagam.com","mobile":"9894463475","cntct_prsn":"karthy","cntct_prsn_mbl":"8667274425"}
-- {"name":"demo","email":"demo@demo.com","password":"demo","source":"android"}
CREATE TABLE IF NOT EXISTS `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(256) NOT NULL  DEFAULT '',
  `website` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `image` varchar(128) NOT NULL  DEFAULT '',
  `logo` varchar(128) NOT NULL  DEFAULT '',
  `address` varchar(512),
  `remarks` varchar(512),
  `cntct_prsn` varchar(128) DEFAULT NULL,
  `cntct_prsn_mbl` varchar(20) DEFAULT NULL,
  `pymntgtwy_user` varchar(32),
  `pymntgtwy_key` varchar(128),
  `posapi_name` varchar(32),
  `posapi_key` varchar(128),
  `users_count` int(11),
  `status` int(1) NOT NULL DEFAULT '1',
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`email`),
  UNIQUE KEY (`mobile`),
  UNIQUE KEY (`pymntgtwy_user`),
  UNIQUE KEY (`pymntgtwy_key`),
  UNIQUE KEY (`posapi_key`),
  KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Table structure for table `qrcodes`
--

CREATE TABLE IF NOT EXISTS `qrcodes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `table_id` varchar(128) NOT NULL,
  `qrc_text` varchar(128) NOT NULL DEFAULT '' COMMENT 'some link or something',
  `qrc_object` varchar(128) NOT NULL DEFAULT '' COMMENT 'object {"company_id":"1","table_id","1"}',
  `description` varchar(256) NOT NULL DEFAULT '',
  `image` varchar(128) NOT NULL  DEFAULT '',
  `target` varchar(16) NOT NULL  DEFAULT 'app' COMMENT 'app, outside',
  `status` int(1) NOT NULL DEFAULT '1',
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  KEY (`company_id`),
  FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` varchar(256) NOT NULL  DEFAULT '',
  `parent_id` int(11) NOT NULL DEFAULT -1,
  `sc_count` int(11),
  `start` varchar(16),
  `end` varchar(16),
  `status` int(1) NOT NULL DEFAULT '1',
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  KEY (`company_id`),
  FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
-- Table structure for table `items`
--

CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id` int(11) NOT NULL,
  `type` varchar(16) NOT NULL  DEFAULT 'simple' COMMENT 'simple,combo,meals',
  `ismealoptions` int(1) DEFAULT '0',
  `name` varchar(128) NOT NULL,
  `description` varchar(500) NOT NULL  DEFAULT '',
  `price` double NOT NULL DEFAULT 0.00,
  `image` varchar(128) NOT NULL  DEFAULT '',
  `stock` int(1) NOT NULL  DEFAULT 1,
  `status` int(1) NOT NULL DEFAULT '1',
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  KEY (`company_id`),
  FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `subcat_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `price` double NOT NULL DEFAULT 0.00 COMMENT '',
  `status` int(1) NOT NULL DEFAULT '1',
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  KEY (`item_id`),
  FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `combo_items`
--

CREATE TABLE IF NOT EXISTS `combo_meal_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master_id` int(11) NOT NULL COMMENT 'either id[of combo type] from items table or id from meal_options table',
  `master_type` varchar(16) NOT NULL  DEFAULT 'item' COMMENT 'items, meal_options',
  `item_id` int(11) NOT NULL,
  `price` double NOT NULL DEFAULT 0.00 COMMENT 'used if meal_options true',
  `status` int(1) NOT NULL DEFAULT '1',
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  KEY (`item_id`),
  FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `meal_options`
--

CREATE TABLE IF NOT EXISTS `meal_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master_id` int(11) NOT NULL COMMENT 'id[of combo type] from items table',
  `name` varchar(128) NOT NULL,
  `isrqrd` int(1) NOT NULL DEFAULT '0',
  `lmtofchoice` int(2) NOT NULL DEFAULT '0',
  `status` int(1) NOT NULL DEFAULT '1',
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  KEY (`master_id`),
  FOREIGN KEY (`master_id`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderid` varchar(128) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_source` varchar(16) COMMENT 'webapp, android, ios',
  `company_id` int(11) NOT NULL,
  `table_id` varchar(128),
  `qr_id` int(11),
  `odate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order_status` int(1) NOT NULL DEFAULT '0' COMMENT '0 in-progress 1 completed 2 cancelled 3 posted',
  `ovalue` double NOT NULL DEFAULT 0.00,
  `tax_prcnt` double NOT NULL DEFAULT 0.00,
  `tax_amnt` double NOT NULL DEFAULT 0.00,
  `total_amnt` double NOT NULL DEFAULT 0.00,
  `dscnt_amnt` double NOT NULL DEFAULT 0.00,
  `dscnt_code` varchar(128),
  `pymnt_amnt` double NOT NULL DEFAULT 0.00 COMMENT 'ovalue + tax_amnt - dscnt_amnt',
  `pymnt_status` int(1) NOT NULL DEFAULT '0' COMMENT '1 paid 0 unpaid',
  `pymnt_mode` int(1) NOT NULL DEFAULT '1'  COMMENT '1 counter 2 card',
  `pymnt_card_dtls` varchar(256) NULL,
  `spl_ins` varchar(256) DEFAULT NULL,
  `remarks` varchar(512) NULL,
  `status` int(1) NOT NULL DEFAULT '1',
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`orderid`),
  KEY (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`company_id`),
  FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Table structure for table `order_items`
--

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `slctd_mo_cmi_ids` varchar(128) COMMENT '1(mo_id)-2,5,7(cmi_ids):6(mo_id)-1,1(cmi_ids):17(mo_id)-""(cmi_ids)',
  `subcat_item_id` int(11) DEFAULT NULL,
  `quantity` int(4) NOT NULL DEFAULT 0,
  `price` double NOT NULL DEFAULT 0.00 COMMENT 'unit price only',
  `xtra_total` double NOT NULL DEFAULT 0.00 COMMENT 'extra prices total',
  `oivalue` double NOT NULL DEFAULT 0.00 COMMENT '(quantity*price)+xtra_total',
  `oidate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `oi_status` int(1) NOT NULL DEFAULT '1' COMMENT '1 confirmed 0 cancelled - only 1s are taken for ovalue-calculation',
  `spl_ins` varchar(256) DEFAULT NULL,
  `remarks` varchar(512) DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT '1',
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
  KEY (`master_id`),
  FOREIGN KEY (`master_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`item_id`),
  FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- inserting into companies
INSERT INTO companies (id, name, description, website, email, mobile, pymntgtwy_user, pymntgtwy_key, posapi_name, posapi_key, status, creator_id) VALUES
(1, 'GSM Company', 'Gsm company description', 'http://gsmrest.com', 'admin@gsmrest.com', '9894453475', 'gsmrest1', 'gsmrest1', 'POS API 2', 'gsmrest1', 1, 1),
(2, 'Konar Mess', 'Konar mess description', 'http://konarmess.com', 'admin@konarmess.com', '9894453476', 'konar1', 'konar1', 'POS API 1', 'konar1', 1, 1),
(3, 'Sai Mess', 'Sai mess description ', 'http://saimess.com', 'admin@saimess.com', '9894453477', 'sai1', 'sai1', 'POS API 2', 'sai1', 1, 1);

-- inserting into users
INSERT INTO users (id, name, email, mobile, source, password_hash, role_id, company_id, status, creator_id) VALUES
(2,'GSM Company','admin@gsmrest.com','9894453475','admin','f361d6092844aac44b8306f83fc39$7ab48cd2a4c26e72c6ee79b44da42b3f8dc5ec0efb9028b234b649280e706bb6329ec2ef335e513dd0d55908a0521e28db127f7c3c53b8c210b27fba0e4927b2',2,1,1,1),
(3,'Konar Mess','admin@konarmess.com','9894453476','admin','f361d6092844aac44b8306f83fc39$7ab48cd2a4c26e72c6ee79b44da42b3f8dc5ec0efb9028b234b649280e706bb6329ec2ef335e513dd0d55908a0521e28db127f7c3c53b8c210b27fba0e4927b2',2,2,1,1),
(4,'Sai Mess','admin@saimess.com','9894453477','admin','f361d6092844aac44b8306f83fc39$7ab48cd2a4c26e72c6ee79b44da42b3f8dc5ec0efb9028b234b649280e706bb6329ec2ef335e513dd0d55908a0521e28db127f7c3c53b8c210b27fba0e4927b2',2,3,1,1),
(5,'demo','demo@demo.com','9894453478','android','f361d6092844aac44b8306f83fc39$7ab48cd2a4c26e72c6ee79b44da42b3f8dc5ec0efb9028b234b649280e706bb6329ec2ef335e513dd0d55908a0521e28db127f7c3c53b8c210b27fba0e4927b2',4,-1,1,-1);

-- inserting into qrcodes
INSERT INTO qrcodes (id, company_id, table_id, status, creator_id) VALUES
(1, 1, "1", 1, 1);

-- inserting seeds for categories
INSERT INTO categories (id, company_id, name, description, parent_id, sc_count, start, `end`, status, creator_id) VALUES
 (1, 1, 'Breakfast', 'Braekfast', -1, 2, 7, 11, 1,1),
 (2, 1, 'Lunch', 'Lunch', -1, 3, 11, 16, 1,1),
 (3, 1, 'Tiffin', 'Tiffin', -1, 0, 16, 19, 1,1),
 (4, 1, 'Dinner', 'Dinner', -1, 0, 19, 23, 1,1),
 (5, 2, 'Breakfast', 'Breakfast', -1, 2, 6, 22, 1,1),
 (6, 2, 'Lunch', 'Lunch', -1, 3, 6, 22, 1,1),
 (7, 2, 'Tiffin', 'Tiffin', -1, 0, 16, 19, 1,1),
 (8, 2, 'Dinner', 'Dinner', -1, 0, 19, 23, 1,1),
 (9, 1, 'Starts and Sides', 's', 2, 0,'', '', 1,1),
 (10, 1, 'Main Dishes', 'm', 2, 0, '', '', 1,1),
 (11, 1, 'Desserts', 'd', 2, 0, '', '', 1,1),
 (12, 1, 'Coffee', 'c', 1, 0, '', '', 1,1),
 (13, 1, 'Freshly baked whole bread', 'f', 1, 0, '', '', 1,1),
 (14, 2, 'Starts and Sides', 's', 6, 0, '', '', 1,1),
 (15, 2, 'Main Dishes', 'm', 6, 0, '', '', 1,1),
 (16, 2, 'Desserts', 'd', 6, 0, '', '', 1,1),
 (17, 2, 'Coffee', 'c', 5, 0, '', '', 1,1),
 (18, 2, 'Freshly baked whole bread', 'f', 5, 0, '', '',1,1),
 (19, 1, 'Tiffin-Spl', 'special tiffin', 3, 0, '', '',1,1),
 (20, 1, 'Dinner-Spl', 'special dinner', 4, 0, '', '',1,1);

-- inserting seeds for simple items pwdgsmonly pwdallothers
INSERT INTO items (id, company_id, type, name, description, price, image, stock, status, creator_id) VALUES
 (1,1,'simple','Cheesy Veg. Roll','Cottage cheese tossed with bell peppers, onions, corn',100,'1.jpg',1,1,1),
 (2,1,'simple','Cheesy Chicken Roll','Chicken tossed with bell peppers, onions, corn, herbs and vegetables topped with cheese in ulta tawa paratha',90,'2.jpg',1,1,1),
 (3,1,'simple','Crispy Chicken Roll','Batter fried crispy chicken chunks with lettuce and chilli mayo wrapped in an ulta tawa paratha',50,'3.jpg',1,1,1),
 (4,1,'simple','Desi Veg. Burrito Roll','Chicken tossed with bell peppers, onions, corn, herbs and vegetables topped with cheese in ulta tawa paratha',200,'4.jpg',1,1,1),
 (5,1,'simple','Desi Chicken Burrito Roll','Chicken with corn, cucumber, bell peppers, lettuce and cheese wrapped in a tortilla bread',211,'5.jpg',1,1,1),
 (6,1,'simple','Bandra Vada Pav','French fries with rollu\'s home-made masala',26,'6.jpg',1,1,1),
 (7,1,'simple','Bun Samosa','(1 pc) Potato and peas samosa with street bun and hot chutney',75,'7.jpg',1,1,1),
 (8,1,'simple','Masala Fries','French fries with rollu\'s home-made masala',150,'8.jpg',1,1,1),
 (9,1,'simple','Desi Veg. Burrito Roll','Tangy paneer with corn, cucumber, bell peppers, lettuce and cheese wrapped in a tortilla bread',211,'1.jpg',1,1,1),
 (10,1,'simple','Integer dapibus','(1 pc) Potato and peas samosa with street bun and hot chutney',100,'1.jpg',1,1,1),
 (11,1,'simple','Bandra Vada Pav','Tangy paneer with corn, cucumber, bell peppers, lettuce and cheese wrapped in a tortilla bread',90,'2.jpg',1,1,1),
 (12,1,'simple','Bun Samosa','Tangy paneer with corn, cucumber, bell peppers, lettuce and cheese wrapped in a tortilla bread',50,'3.jpg',1,1,1),
 (13,1,'simple','Masala Fries','(1 pc) Potato and peas samosa with street bun and hot chutney',211,'5.jpg',1,1,1),
 (14,1,'simple','Cheesy Veg. Roll','Batter fried crispy chicken chunks with lettuce and chilli mayo wrapped in an ulta tawa paratha',75,'7.jpg',1,1,1),
 (15,1,'simple','Desi Chicken Burrito Roll','Tangy paneer with corn, cucumber, bell peppers, lettuce and cheese wrapped in a tortilla bread',100,'8.jpg',1,1,1),
 (16,1,'simple','Crispy Chicken Roll','Batter fried crispy chicken chunks with lettuce and chilli mayo wrapped in an ulta tawa paratha',211,'5.jpg',1,1,1),
 (17,1,'combo','Veg&Non-Veg','both veg and non-veg','375','1.jpg',1,1,1),
 (18,1,'simple','Blue Cheese','Blue chees','50','1.jpg',1,1,1),
 (19,1,'simple','BBQ Sauce','BBQ Sauce','70','1.jpg',1,1,1),
 (20,1,'simple','Honey Mustard','Honey Mustard','60','1.jpg',1,1,1),
 (21,1,'simple','Coke','Coke','5','1.jpg',1,1,1),
 (22,1,'simple','Diet Coke','Diet Coke','6','1.jpg',1,1,1),
 (23,1,'simple','Ginger Ale','Ginger Ale','5','1.jpg',1,1,1),
 (24,1,'simple','Sprite','Sprite','5','1.jpg',1,1,1),
 (25,1,'simple','Water','Water','1','1.jpg',1,1,1),
 (26,1,'simple','French Fries','French Fries','2','1.jpg',1,1,1),
 (27,1,'simple','Side Salad','Side Salad','1','1.jpg',1,1,1),
 (28,1,'simple','Pakoda','Pakoda','1','1.jpg',1,1,1),
 (29,1,'simple','Extra Crispy Chicken Filet','Extra Crispy Chicken Filet','15','1.jpg',1,1,1),
 (30,1,'simple','Extra Grilled Chicken Filet','Extra Grilled Chicken Filet','15','1.jpg',1,1,1);

-- inserting into meal_options
INSERT INTO meal_options (id, master_id, name, isrqrd, lmtofchoice, status, creator_id) VALUES
(1, 17, 'What Sauce would you like?', 1, 1, 1, 1),
(2, 17, 'Choice Of Drink', 0, 2, 1, 1),
(3, 17, 'SELECT SIDE', 0, 1, 1, 1),
(4, 17, 'EXTEA', 0, 0, 1, 1);

-- inserting into combo_meal_items
INSERT INTO combo_meal_items (id, master_id, master_type, item_id, price, status, creator_id) VALUES
(1, 17, 'items', 1, 0, 1, 1),
(2, 17, 'items', 2, 0, 1, 1),
(3, 1, 'meal_options', 18, 0, 1, 1),
(4, 1, 'meal_options', 19, 0, 1, 1),
(5, 1, 'meal_options', 20, 0, 1, 1),
(6, 2, 'meal_options', 21, 0, 1, 1),
(7, 2, 'meal_options', 22, 0, 1, 1),
(8, 2, 'meal_options', 23, 20, 1, 1),
(9, 2, 'meal_options', 24, 0, 1, 1),
(10, 2, 'meal_options', 25, 0, 1, 1),
(11, 3, 'meal_options', 26, 1, 1, 1),
(12, 3, 'meal_options', 27, -.5, 1, 1),
(13, 3, 'meal_options', 28, 0, 1, 1),
(14, 4, 'meal_options', 29, 10, 1, 1),
(15, 4, 'meal_options', 30, 10, 1, 1);

-- inserting into subcat_items
INSERT INTO subcat_items (id, master_id, item_id, price, status, creator_id) VALUES
(1, 9, 1, 0, 1, 1),
(2, 9, 2, 0, 1, 1),
(3, 9, 3, 0, 1, 1),
(4, 9, 4, 0, 1, 1),
(5, 9, 5, 0, 1, 1),
(6, 10, 6, 0, 1, 1),
(7, 10, 7, 0, 1, 1),
(8, 10, 8, 0, 1, 1),
(9, 10, 9, 0, 1, 1),
(10, 11, 10, 0, 1, 1),
(11, 11, 11, 0, 1, 1),
(12, 11, 12, 0, 1, 1),
(13, 12, 13, 0, 1, 1),
(14, 12, 14, 0, 1, 1),
(15, 12, 15, 0, 1, 1),
(16, 13, 16, 0, 1, 1),
(17, 13, 17, 0, 1, 1),
(18, 13, 1, 0, 1, 1),
(19, 19, 2, 0, 1, 1),
(20, 19, 3, 0, 1, 1),
(21, 20, 4, 0, 1, 1),
(22, 20, 5, 0, 1, 1);

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET SQL_SAFE_UPDATES=@OLD_SQL_SAFE_UPDATES */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;