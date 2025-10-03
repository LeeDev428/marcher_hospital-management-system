-- Setup script for Marcher Hospital Management System databases
-- Run this script as the postgres superuser

-- Create the global database
CREATE DATABASE "marcher-global"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_Philippines.1252'
    LC_CTYPE = 'English_Philippines.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE "marcher-global" IS 'Global database for Marcher Hospital Management System - contains shared data across all hospital instances';

-- Create the instance database  
CREATE DATABASE "marcher-instance"
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_Philippines.1252'
    LC_CTYPE = 'English_Philippines.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE "marcher-instance" IS 'Instance database for Marcher Hospital Management System - contains tenant-specific data';

-- Create a database user for the application (optional but recommended)
-- CREATE USER marcher_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
-- GRANT ALL PRIVILEGES ON DATABASE "marcher-global" TO marcher_user;
-- GRANT ALL PRIVILEGES ON DATABASE "marcher-instance" TO marcher_user;

-- List the created databases
\l "marcher-*"
