/* Yalnızca B2B veritabanında çalıştırın (bkz. V001__create_b2b_schema.sql notu). */

ALTER TABLE B2B_USERS ADD PASSWORD_HASH VARCHAR(256) NOT NULL;
