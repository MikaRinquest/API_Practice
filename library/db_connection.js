// This file will create a connection to the database
const mysql = require("mysql");
const creds = require("../config/creds");

// Here to is use across multiple files. Used to make SQL queries to DB
const con = mysql.createConnection({
  host: creds.DB_HOST,
  user: creds.DB_USER,
  password: creds.DB_PASS,
  database: creds.DB_NAME,
  multipleStatements: true,
});

module.exports = con;
