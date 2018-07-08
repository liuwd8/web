create database if not exists CSMS;
CREATE USER 'csmsAdmin'@'localhost' IDENTIFIED BY 'sysu615@';
GRANT ALL ON csms.* TO 'csmsAdmin'@'localhost';
use CSMS;
-- 用户表
create table if not exists users (
    username char(20) not null,
    password char(20) not null,
    status int default 0,
    primary key(username)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- 工厂信息表
create table if not exists FactoryInfo(
    FName char(10) not null,
    primary key(FName)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into factoryinfo values ('通用汽车');
insert into factoryinfo values ('大众汽车');
insert into factoryinfo values ('福特汽车');
insert into factoryinfo values ('本田汽车');
insert into factoryinfo values ('丰田汽车');

create table if not exists CarInfo(
    CName char(10) not null,
    CType char(10),
    CPrice char(10) not null,
    FName char(10) not null,
    primary key(CName),
    foreign key (FName) references FactoryInfo(FName) on delete no action
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into carinfo values ('雪佛兰', '轿车', '250000','通用汽车');
insert into carinfo values ('别克', '轿车', '290000','通用汽车');
insert into carinfo values ('斯柯达', '轿车', '160000','大众汽车');
insert into carinfo values ('帕萨特', '轿车', '240000','大众汽车');
insert into carinfo values ('途昂', '越野车', '400000','大众汽车');
insert into carinfo values ('野马', '跑车', '500000','福特汽车');
insert into carinfo values ('F-150', '皮卡车', '600000','福特汽车');
insert into carinfo values ('思域', '轿车', '200000','本田汽车');
insert into carinfo values ('雅阁', '轿车', '200000','本田汽车');
insert into carinfo values ('卡罗拉', '轿车', '150000','丰田汽车');
insert into carinfo values ('凯美瑞', '轿车', '220000','丰田汽车');

create table if not exists CustomerInfo(
    CusID int auto_increment,
    CusName char(10) not null,
    CusPhone char(20),
    primary key(CusID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into customerinfo values ('0','刘伟东','16340155');
insert into customerinfo values ('0','刘亚辉','16340157');
insert into customerinfo values ('0','刘宇庭','16340158');

create table if not exists CarInventory(
    CName char(10) not null,
    CarNum int default 0,
    primary key(CName),
    foreign key(CName) references CarInfo(CName) on delete no action
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

delimiter //
create trigger carinventory before update on CarInventory
for each row
begin
if new.CarNum < 0 then
signal sqlstate '12345' set MESSAGE_TEXT = '库存不能小于0';
end if;
end;
//
delimiter ;

insert into CarInventory values ('雪佛兰', '20');
insert into CarInventory values ('别克', '10');
insert into CarInventory values ('斯柯达', '15');
insert into CarInventory values ('帕萨特', '20');
insert into CarInventory values ('途昂', '5');
insert into CarInventory values ('野马', '5');
insert into CarInventory values ('F-150', '3');
insert into CarInventory values ('思域', '25');
insert into CarInventory values ('雅阁', '35');
insert into CarInventory values ('卡罗拉', '14');
insert into CarInventory values ('凯美瑞', '21');


-- 进货
create table if not exists PurchaseInfo(
   PID int auto_increment,
   CName char(10) not null,
   CNum int not null,
   PPrice int not null, -- 进货单价
   PDate Datetime DEFAULT CURRENT_TIMESTAMP,
   primary key(PID),
   foreign key(CName) references CarInfo(CName) on delete no action
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 库存改变
create table if not exists InAndOutInfo(
   InAndOutID int auto_increment,
   CName char(10) not null,
   InAndOutNum int not null,
   InAndOutType char(10) not null,
   InAndOutDate Datetime DEFAULT CURRENT_TIMESTAMP,
   primary key(InAndOutID),
   foreign key(CName) references CarInfo(CName) on delete no action
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 出货/用户购买信息
create table if not exists SaleInfo(
   SID int auto_increment,
   CName char(10) not null,
   SNum int not null,
   SDate Datetime DEFAULT CURRENT_TIMESTAMP,
   SPrice int not null,
   CusID int,
   primary key(SID),
   foreign key(CName) references CarInfo(CName) on delete no action,
   foreign key(CusID) references CustomerInfo(CusID) on delete no action
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP PROCEDURE IF EXISTS purchase;
DELIMITER //
CREATE PROCEDURE purchase(in param_name char(10), in param_num int, in param_price int)
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
begin
rollback;
signal sqlstate '12346' set MESSAGE_TEXT = 'purchase EXCEPTION';
end;
START TRANSACTION;
insert into carinventory values (param_name,param_num) on duplicate key update CarNum = CarNum + param_num;
insert into purchaseinfo (CName,CNum,PPrice) values (param_name,param_num,param_price);
insert into inandoutinfo (CName,InAndOutNum,InAndOutType) values (param_name,param_num, '入库');
select * from purchaseinfo;
COMMIT;
END//
DELIMITER ;

DROP PROCEDURE IF EXISTS sale;
DELIMITER //
CREATE PROCEDURE sale(in param_name char(10), in param_num int, in param_price int, in param_cusid int)
BEGIN
DECLARE EXIT HANDLER FOR SQLEXCEPTION
begin
rollback;
signal sqlstate '12347' set MESSAGE_TEXT = 'sale EXCEPTION';
end;
START TRANSACTION;
update carinventory set CarNum = CarNum - param_num where CName = param_name;
insert into saleinfo (CName,SNum,SProfit,CusID) values (param_name,param_num,param_price,param_cusid);
insert into inandoutinfo (CName,InAndOutNum,InAndOutType) values(param_name,param_num,'出库');
select * from saleinfo, customerinfo, carinfo
where saleinfo.CusID = customerinfo.CusID and saleinfo.CName = carinfo.CName;
COMMIT;
END//
DELIMITER ;