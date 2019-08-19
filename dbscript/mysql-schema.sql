CREATE USER 'test'@'localhost' IDENTIFIED BY 'pwd1um*llai@';
CREATE USER 'test'@'%' IDENTIFIED BY 'pwd1um*llai@';
CREATE DATABASE /*!32312 IF NOT EXISTS*/`wagerappdb` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
GRANT ALL ON *.* to 'test'@'localhost';
GRANT ALL ON *.* to 'test'@'%';
USE `wagerappdb`;

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
 INSERT INTO users (id, name, email, mobile, password_hash, role_id, issuper) VALUES
 (1, 'Gsm', 'gsmmgsm@gmail.com', '8667274425'
 , 'f361d6092844aac44b8306f83fc39$ab219ab9f1352285252ea51f9dcbaac7f4fc681fde3cd483915b86730b3710b38dcc150e6655e1fd32482ad38034b0ba212e8397ac79baf32d92e7718c8256e3'
 ,1,1);

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

-- inserting into companies
INSERT INTO companies (id, name, description, website, email, mobile, pymntgtwy_user, pymntgtwy_key, posapi_name, posapi_key, status, creator_id) VALUES
(1, 'Company Name', 'Description', 'http://wagerapp.com', 'admin@wagerapp.com', '9894453475', 'payment gateway user', 'payment gateway key', 'POS API 2', 'gsmrest1', 1, 1);

-- inserting into users
INSERT INTO users (id, name, email, mobile, source, password_hash, role_id, company_id, creator_id) VALUES
(2,'Company Admin','admin@wagerapp.com','9894453475','admin','f361d6092844aac44b8306f83fc39$ab219ab9f1352285252ea51f9dcbaac7f4fc681fde3cd483915b86730b3710b38dcc150e6655e1fd32482ad38034b0ba212e8397ac79baf32d92e7718c8256e3',2,1,1);

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET SQL_SAFE_UPDATES=@OLD_SQL_SAFE_UPDATES */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

CREATE TABLE IF NOT EXISTS `companies` (
  `id` varchar(36) NOT NULL,
  `sender_email` varchar(40) NOT NULL,
  `recipient_email` varchar(40) NOT NULL,
  'amount' decimal(4,2) NOT NULL,
  'status' varchar(9) NOT NULL,
  `creator_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifier_id` int(11) DEFAULT NULL,
  `modified_at` DATETIME,
  PRIMARY KEY (`id`),
   KEY (`creator_id`),
  FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY (`modifier_id`),
  FOREIGN KEY (`modifier_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);