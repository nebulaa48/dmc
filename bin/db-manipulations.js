const db = require("./connection");

const DB_MANIPULATION = {
  multipleTablesDesc: (dbName, callback) =>
    db.query(
      "SELECT TABLE_NAME as 'table', COLUMN_NAME as 'column', DATA_TYPE as 'type', IS_NULLABLE as 'nullable', COLUMN_KEY as 'key_type', COLUMN_DEFAULT as 'default', EXTRA as 'extra' from information_schema.COLUMNS WHERE TABLE_SCHEMA='" +
        dbName +
        "'; ",
      function (err, result) {
        if (err) throw err;
        callback(result);
      }
    ),
  tableDesc: (dbName, table, callback) =>
    db.query(
      "SELECT TABLE_NAME as 'table', COLUMN_NAME as 'column', DATA_TYPE as 'type', IS_NULLABLE as 'nullable', COLUMN_KEY as 'key_type', COLUMN_DEFAULT as 'default', EXTRA as 'extra' from information_schema.COLUMNS WHERE TABLE_SCHEMA='" +
        dbName +
        "' AND TABLE_NAME='" +
        table +
        "'; ",
      function (err, result) {
        if (err) throw err;
        callback(result);
      }
    ),
};

module.exports = DB_MANIPULATION;
