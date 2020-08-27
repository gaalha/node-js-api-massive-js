DROP DATABASE angular_crud;
CREATE DATABASE angular_crud;

CREATE TABLE user_app(
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(250) NOT NULL UNIQUE,
    email VARCHAR(500) NOT NULL UNIQUE,
    password VARCHAR(500) NOT NULL,
    password_token VARCHAR(500) NULL,
    created_at TIMESTAMP(6) NULL,
    updated_at TIMESTAMP(6) NULL,
    deleted_at TIMESTAMP(6) NULL
);

CREATE TABLE client(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    age INTEGER NOT NULL ,
    gender VARCHAR(20) NOT NULL ,
    created_at TIMESTAMP(6) NULL,
    updated_at TIMESTAMP(6) NULL,
    deleted_at TIMESTAMP(6) NULL
);