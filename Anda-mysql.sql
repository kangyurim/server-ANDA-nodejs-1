use UMCanda;

CREATE TABLE User(
    `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) UNIQUE NOT NULL,
    `password` text NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `birthDate` DATE,
    `recommendUserId` BIGINT,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    PRIMARY KEY (id, email)
);

insert into User(name, email, password, phone, birthdate, recommendUserId)
        VALUES('test1', 'test1@naver.com','test1pw', '010-0000-0000', '00-01-01', NULL);
SELECT * FROM User;

# JWT Table
CREATE TABLE RefreshToken(
    `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `email` VARCHAR(50) NOT NULL,
    `refreshToken` text NOT NULL,

    PRIMARY KEY (id, email),
    FOREIGN KEY (email) REFERENCES User(email)
);


CREATE TABLE Ophthalmology(
    `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `name` VARCHAR(100) NOT NULL,
    `cityName` VARCHAR(30) NOT NULL,
    `townName` VARCHAR(30) NOT NULL,
    `postCode` BIGINT,
    `address` text NOT NULL,
    `phoneNumber` text,
    `URL` text,
    `xCoordi` FLOAT(10,10),
    `yCoordi` FLOAT(10,10),
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    PRIMARY KEY (id)
);
drop table Ophthalmology;
drop table User;

CREATE TABLE IF NOT EXISTS Ophthalmology (
    `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `name` VARCHAR(100) NOT NULL,
    `cityName` VARCHAR(30) NOT NULL,
    `townName` VARCHAR(30) NOT NULL,
    `postCode` BIGINT,
    `address` text NOT NULL,
    `phoneNumber` text,
    `URL` text,
    `xCoordi` NUMERIC(10, 7),
    `yCoordi` NUMERIC(10, 8),
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',
    PRIMARY KEY (id)
);
ALTER TABLE Ophthalmology ADD `id` BIGINT AUTO_INCREMENT

CREATE TABLE Review(
     `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ophthalmologyId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `reviewText` text NOT NULL,
    `score` DECIMAL(4, 2) NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    FOREIGN KEY (ophthalmologyId) REFERENCES Ophthalmology(id),
    FOREIGN KEY (userId) REFERENCES User(id),

    PRIMARY KEY (id)
);

CREATE TABLE ReviewMedia(
    `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `reviewId` BIGINT NOT NULL,
    `picURL` text NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    PRIMARY KEY (id)
);

CREATE TABLE LasecReview(
     `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ophthalmologyId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `reviewText` text NOT NULL,
    `score` DECIMAL(4, 2) NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    FOREIGN KEY (ophthalmologyId) REFERENCES Ophthalmology(id),
    FOREIGN KEY (userId) REFERENCES User(id),

    PRIMARY KEY (id)
);

CREATE TABLE LasecReviewMedia(
    `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `reviewId` BIGINT NOT NULL,
    `picURL` text NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    PRIMARY KEY (id)
);

CREATE TABLE LasicReview(
     `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ophthalmologyId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `reviewText` text NOT NULL,
    `score` DECIMAL(4, 2) NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    FOREIGN KEY (ophthalmologyId) REFERENCES Ophthalmology(id),
    FOREIGN KEY (userId) REFERENCES User(id),

    PRIMARY KEY (id)
);

CREATE TABLE LasicReviewMedia(
    `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `reviewId` BIGINT NOT NULL,
    `picURL` text NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    PRIMARY KEY (id)
);

CREATE TABLE SmileLasicReview(
     `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ophthalmologyId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `reviewText` text NOT NULL,
    `score` DECIMAL(4, 2) NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    FOREIGN KEY (ophthalmologyId) REFERENCES Ophthalmology(id),
    FOREIGN KEY (userId) REFERENCES User(id),

    PRIMARY KEY (id)
);

CREATE TABLE SmileLasicReviewMedia(
    `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `reviewId` BIGINT NOT NULL,
    `picURL` text NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    PRIMARY KEY (id)
);

CREATE TABLE LensInsertReview(
     `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `ophthalmologyId` BIGINT NOT NULL,
    `userId` BIGINT NOT NULL,
    `reviewText` text NOT NULL,
    `score` DECIMAL(4, 2) NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    FOREIGN KEY (ophthalmologyId) REFERENCES Ophthalmology(id),
    FOREIGN KEY (userId) REFERENCES User(id),

    PRIMARY KEY (id)
);

CREATE TABLE LensInsertReviewMedia(
    `id` BIGINT AUTO_INCREMENT,
    `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `reviewId` BIGINT NOT NULL,
    `picURL` text NOT NULL,
    `status` VARCHAR(10) DEFAULT 'Activated' COMMENT 'Activate: 활성화된 상태, Inactivated: 비활성화된 상태,Block: 블락된 상태, Delete: 삭제된 상태',

    PRIMARY KEY (id)
);


select  name, cityname, townname, postcode, address, phonenumber, url, xCoordi, yCoordi,(6371*acos(cos(radians(37.5611326))*cos(radians(Op.yCoordi))*cos(radians(Op.xCoordi)-radians(127.033311))
+sin(radians(37.5611326))*sin(radians(Op.yCoordi)))) AS distance
from Ophthalmology AS Op
having distance < 3
order by distance DESC;

select * from Ophthalmology WHERE cityName="서울";

SELECT *
FROM LensInsertReview
WHERE ophthalmologyId = 10000

SELECT *
FROM LensInsertReviewMedia
WHERE reviewId = 2