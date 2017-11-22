-- MySQL Script generated by MySQL Workbench
-- Sun Nov 19 13:26:30 2017
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema games
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `games` ;

-- -----------------------------------------------------
-- Schema games
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `games` DEFAULT CHARACTER SET utf8 ;
USE `games` ;

-- -----------------------------------------------------
-- Table `games`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `games`.`user` ;

CREATE TABLE IF NOT EXISTS `games`.`user` (
  `username` NVARCHAR(20) NOT NULL,
  `password` NVARCHAR(20) NOT NULL,
  `email` NVARCHAR(50) NOT NULL,
  `address` NVARCHAR(100) NOT NULL,
  `banned` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`username`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `games`.`product`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `games`.`product` ;

CREATE TABLE IF NOT EXISTS `games`.`product` (
  `idproduct` INT NOT NULL AUTO_INCREMENT,
  `name` NVARCHAR(40) NOT NULL,
  `price` FLOAT NOT NULL,
  `stock` INT NOT NULL,
  `imgpath` NVARCHAR(100) NOT NULL,
  `sale` FLOAT NOT NULL,
  `platform` INT NOT NULL,
  `sales` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`idproduct`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `games`.`order`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `games`.`order` ;

CREATE TABLE IF NOT EXISTS `games`.`order` (
  `idorder` INT NOT NULL,
  `username` NVARCHAR(50) NOT NULL,
  `idproduct` INT NOT NULL,
  `quantity` INT NOT NULL,
  `status` INT NOT NULL,
  PRIMARY KEY (`idorder`, `username`, `idproduct`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `games`.`coupon`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `games`.`coupon` ;

CREATE TABLE IF NOT EXISTS `games`.`coupon` (
  `idcoupon` NVARCHAR(20) NOT NULL,
  `discount` FLOAT NOT NULL,
  PRIMARY KEY (`idcoupon`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `games`.`couponorder`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `games`.`couponorder` ;

CREATE TABLE IF NOT EXISTS `games`.`couponorder` (
  `idorder` INT NOT NULL,
  `coupon` NVARCHAR(20) NOT NULL,
  PRIMARY KEY (`idorder`, `coupon`),
  INDEX `coupon_idx` (`coupon` ASC),
  CONSTRAINT `idorder`
    FOREIGN KEY (`idorder`)
    REFERENCES `games`.`order` (`idorder`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `coupon`
    FOREIGN KEY (`coupon`)
    REFERENCES `games`.`coupon` (`idcoupon`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `games`.`cart`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `games`.`cart` ;

CREATE TABLE IF NOT EXISTS `games`.`cart` (
  `username` NVARCHAR(50) NOT NULL,
  `idproduct` INT NOT NULL,
  `quantity` INT NOT NULL,
  `status` INT NOT NULL,
  PRIMARY KEY (`username`, `idproduct`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
