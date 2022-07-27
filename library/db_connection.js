// This file will create a connection to the database
const mysql = require("mysql");
require("dotenv").config();

// Here to is use across multiple files. Used to make SQL queries to DB
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

module.exports = con;
