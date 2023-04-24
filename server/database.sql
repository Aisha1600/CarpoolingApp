CREATE DATABASE Carpooling;

--bin folder of postgres
--run cmd
--psql -U postgres
--\c [database name] to connect to db and then run the queries 

CREATE TABLE MEMBER(
   MEMBER_ID SERIAL PRIMARY KEY NOT NULL,
   F_NAME VARCHAR(50) NOT NULL,
   L_NAME VARCHAR(50) NOT NULL,
   EMAIL VARCHAR(255) UNIQUE NOT NULL CHECK (EMAIL ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
   CONTACT_NO INT UNIQUE NOT NULL,
   LICENSE_NO INT UNIQUE NULL,
   LICENSE_VALID_FROM DATE NULL,
   GENDER CHAR(1) NOT NULL CHECK (GENDER IN ('M', 'F')), 
   PASSWORD CHAR(50) NOT NULL,
   CNIC INT NOT NULL 
);

   CREATE TABLE CAR(
   CAR_ID SERIAL PRIMARY KEY,
   NAME CHAR(50) NULL,
   MODEL CHAR(50) NULL,
   MAKE_YEAR NUMERIC(4) NULL,
  -- RATING NUMERIC(1)
);

CREATE TABLE MEMBER_CAR(
   MCAR_ID SERIAL PRIMARY KEY NOT NULL,
   MEMBER_ID INT NOT NULL,
   CAR_ID INT NOT NULL,
   CAR_REGNO VARCHAR(50) UNIQUE NOT NULL,
   CAR_COLOR VARCHAR(50) NOT NULL,
   FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID) ON DELETE CASCADE,
   FOREIGN KEY (CAR_ID) REFERENCES CAR (CAR_ID) ON DELETE CASCADE
);

CREATE TABLE DESTINATION(
   DESTINATION_ID SERIAL PRIMARY KEY NOT NULL,
   D_NAME VARCHAR(50) NOT NULL,
   SOURCE_NAME VARCHAR(50) NOT NULL,
   D_ADDRESS CHAR(50) NOT NULL,
   S_ADDRESS CHAR(50) NOT NULL
);

--Ride – A member can create a ride by filling which car he is traveling by; 
--which city he is starting from; which city he is heading towards; 
--the date and time of the journey; the number of seats available; 
--and contribution per head. The contribution per head is the amount that each co-traveler has to pay towards ride expenses.


CREATE TABLE RIDE(
   RIDE_ID SERIAL PRIMARY KEY NOT NULL,
   DESTINATION_ID INT NOT NULL,
   MCAR_ID INT NOT NULL,
   CREATED_ON DATE NOT NULL,
   TRAVEL_START_TIME TIMESTAMP,
   SEATS_OFFERED NUMERIC(1) NOT NULL,
   CONTRIBUTION_PER_HEAD NUMERIC(1) NOT NULL, 
   FOREIGN KEY (DESTINATION_ID) REFERENCES DESTINATION (DESTINATION_ID) ON DELETE CASCADE,
   FOREIGN KEY (MCAR_ID) REFERENCES MEMBER_CAR (MCAR_ID) ON DELETE CASCADE
);


--Ride Request – Members can look at the list of available rides from one city to another or put in a request for a 
--specific trip. We definitely need one table to store details about such requests. 
-- A table called request fits the purpose. The request is initially entered as a ‘submitted’ request, and 
--the ride owner is the only person who is allowed to approve or reject it. The number of available seats in the ride 
--table will be adjusted for each approval and/or rejection.

CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE REQUEST (
   REQUEST_ID SERIAL PRIMARY KEY,
   MEMBER_ID INT NOT NULL, --of the requester this requester is someone who 1) makes submits a request 2) creates their own ride request
   RIDE_ID INT NOT NULL,  
   CREATED_ON TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   STATUS request_status NOT NULL DEFAULT 'PENDING',
   FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID) ON DELETE CASCADE,
   FOREIGN KEY (RIDE_ID) REFERENCES RIDE (RIDE_ID) ON DELETE CASCADE
);

CREATE TABLE PREFERENCE(
   PREFERENCE_ID SERIAL PRIMARY KEY,
   IS_SMOKING_ALLOWED BOOLEAN NOT NULL,
   IS_ALL_FEMALE BOOLEAN NOT NULL,
   NOTES VARCHAR(255) NULL
); 

CREATE TABLE MEMBER_PREFERENCE_BTABLE(
   MEMBERPERFERENCE_ID INT PRIMARY KEY NOT NULL,
   MEMBER_ID INT NOT NULL,
   PREFERENCE_ID INT NOT NULL,
   FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER (MEMBER_ID) ON DELETE CASCADE,
   FOREIGN KEY (PREFERENCE_ID) REFERENCES PREFERENCE (PREFERENCE_ID) ON DELETE CASCADE
);

-- changes made
ALTER TABLE member DROP COLUMN LICENSE_NO;
ALTER TABLE member DROP COLUMN LICENSE_VALID_FROM;

ALTER TABLE CAR ADD COLUMN LICENSE_NO INT UNIQUE NULL; 
ALTER TABLE CAR ADD COLUMN LICENSE_VALID_FROM DATE NULL; 

--more changes 
-- Add columns to the MEMBER table
ALTER TABLE MEMBER
ADD COLUMN LICENSE_NO INT UNIQUE NULL,
ADD COLUMN LICENSE_VALID_FROM DATE NULL;

-- Remove columns from the CAR table
ALTER TABLE CAR
DROP COLUMN LICENSE_NO,
DROP COLUMN LICENSE_VALID_FROM;

-- add MEMBER_ID as foreign key in PREFERENCE table
ALTER TABLE PREFERENCE
ADD COLUMN MEMBER_ID INT NOT NULL,
ADD CONSTRAINT fk_member_id
FOREIGN KEY (MEMBER_ID) REFERENCES MEMBER(MEMBER_ID) ON DELETE CASCADE;

-- drop MEMBER_PREFERENCE_BTABLE table
DROP TABLE MEMBER_PREFERENCE_BTABLE;

-- more changes
ALTER TABLE MEMBER
ALTER COLUMN CONTACT_NO TYPE VARCHAR(13),
ALTER COLUMN CNIC TYPE VARCHAR(13);

ALTER TABLE MEMBER
ADD CONSTRAINT contact_no_length CHECK (length(contact_no) = 13),
ADD CONSTRAINT cnic_length CHECK (length(cnic) = 13);

ALTER TABLE destination
DROP COLUMN D_ADDRESS,
DROP COLUMN S_ADDRESS;

ALTER TABLE ride 
ALTER COLUMN contribution_per_head TYPE INTEGER USING contribution_per_head::integer,

--more changed gdi im tired cmon 

ALTER TABLE ride
ALTER COLUMN ride_rating SET DEFAULT NULL;

ALTER TABLE REQUEST DROP COLUMN STATUS;

--smol apis for this
CREATE TABLE REQUEST_S (
   STATUS_ID SERIAL PRIMARY KEY,
   STATUS request NOT NULL
);

ALTER TABLE REQUEST_S DROP COLUMN STATUS;

-- Add a new STATUS column to the REQUEST_STATUS table
ALTER TABLE REQUEST_STATUS ADD COLUMN STATUS req NOT NULL DEFAULT 'PENDING';

-- Add a foreign key reference to the request_status table from the REQUEST table
ALTER TABLE REQUEST ADD COLUMN status_id INT NOT NULL REFERENCES request_status(status_id);

-- Create a new table for RIDE_RATING
CREATE TABLE RIDE_RATING (
   RATING_ID SERIAL PRIMARY KEY,
   RATING NUMERIC(2,1) NOT NULL
);

-- Remove the RIDE_RATING column from the RIDE table
ALTER TABLE RIDE DROP COLUMN RIDE_RATING;

-- Add a foreign key reference to the RIDE_RATING table from the RIDE table
ALTER TABLE RIDE ADD COLUMN RATING_ID INT REFERENCES RIDE_RATING(RATING_ID) ON DELETE SET NULL;

--for jwt tokens
CREATE TABLE jwt_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL
);
 ALTER TABLE jwt_tokens ADD COLUMN member_id INTEGER REFERENCES member(MEMBER_ID);








