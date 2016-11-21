DROP DATABASE IF EXISTS users;
CREATE DATABASE users;

\c users;

CREATE TABLE user (
  id INTEGER,
  name VARCHAR,
  email VARCHAR,
  password VARCHAR
);
