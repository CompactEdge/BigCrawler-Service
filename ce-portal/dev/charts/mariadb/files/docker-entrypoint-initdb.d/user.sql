CREATE DATABASE `mano_rsc`;
USE `mano_rsc`;

CREATE TABLE `TableUser` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Username` varchar(255),
  `Password` varchar(255),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `TableProfile` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `Email` varchar(255),
  `Phone` varchar(255),
  `RealName` varchar(255),
  `Status` varchar(255),
  `UserGroup` varchar(255),
  `UserID` bigint(20) unsigned,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`UserID`) REFERENCES `TableUser`(`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- base64
-- INSERT INTO `TableUser` (`Username`, `Password`) VALUES ('admin', 'MTIzNA==');
-- bcrypt
INSERT INTO `TableUser` (`Username`, `Password`) VALUES ('admin', '$2a$10$HVtDMM0Q/XGuxuN0Q2jRdO2A5n3AB0YmP4EmYUj.01iPuVTFd6dUu');
INSERT INTO `TableProfile` (`UserID`) VALUES (1);