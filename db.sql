--DATABASE admin_budget

-- Create table -> category.
CREATE TABLE category(
id SERIAL,
description VARCHAR (100) NOT NULL,
PRIMARY KEY(id));

INSERT INTO category (description) VALUES ('Comida');
INSERT INTO category (description) VALUES ('Ropa');
INSERT INTO category (description) VALUES ('Casa');
INSERT INTO category (description) VALUES ('Diversión');

-- Create table -> user.
CREATE TABLE users(
id SERIAL,
name VARCHAR (100) NOT NULL,
email VARCHAR (100) NOT NULL,
password VARCHAR (10) NOT NULL,
PRIMARY KEY(id));
CREATE UNIQUE INDEX idx_users_email
ON users(email);

INSERT INTO users (name, email, password) VALUES ('Prueba', 'prueba@gmail.com', '123456');

-- Create table -> budget.
CREATE TABLE budget(
id SERIAL,
concept VARCHAR (100) NOT NULL,
amount NUMERIC (19,2) NOT NULL,
date TIMESTAMP(6) NOT NULL,
date_update TIMESTAMP(6) NOT NULL,
type NUMERIC(1,0) NOT NULL,
id_category INTEGER NOT NULL,
id_user INTEGER NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY(id_category) REFERENCES category(id),
FOREIGN KEY(id_user) REFERENCES users(id));

COMMENT ON COLUMN budget.type IS '1=Ingreso, 0=Egreso';

-- Create table -> user_balance.
CREATE TABLE user_balance(
id SERIAL,
id_user INTEGER NOT NULL,
balance NUMERIC (19,2) NOT NULL,
total_revenue NUMERIC (19,2) NOT NULL,
total_expenditure NUMERIC (19,2) NOT NULL,
PRIMARY KEY(id),
FOREIGN KEY(id_user) REFERENCES users(id));