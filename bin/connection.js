const dotenv = require("dotenv");
const mysql = require("mysql");

dotenv.config();

var connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

module.exports = connection;
