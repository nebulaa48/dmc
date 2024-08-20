import { connection } from "./connection.js";
import { errorHandler } from "../generator/error-handler.js";
import Error from "../entities/error.js";

export const DB = {
  multipleTablesDesc: (dbName, callback) =>
    query(
      "SELECT TABLE_NAME as 'table', COLUMN_NAME as 'column', DATA_TYPE as 'type', IS_NULLABLE as 'nullable', COLUMN_KEY as 'key_type', COLUMN_DEFAULT as 'default', EXTRA as 'extra' from information_schema.COLUMNS WHERE TABLE_SCHEMA='" +
        dbName +
        "'; ",
      function (err, result) {
        if (err) {
          errorHandler(err);
        } else {
          if (result.length > 0) {
            callback(result);
          } else {
            errorHandler(new Error("EMPTY_DB", dbName + " is empty."));
          }
        }
      }
    ),
  tableDesc: (dbName, table, callback) =>
    query(
      "SELECT TABLE_NAME as 'table', COLUMN_NAME as 'column', DATA_TYPE as 'type', IS_NULLABLE as 'nullable', COLUMN_KEY as 'key_type', COLUMN_DEFAULT as 'default', EXTRA as 'extra' from information_schema.COLUMNS WHERE TABLE_SCHEMA='" +
        dbName +
        "' AND TABLE_NAME='" +
        table +
        "'; ",
      function (err, result) {
        if (err) {
          errorHandler(err);
        } else {
          if (result.length > 0) {
            callback(result);
          } else {
            errorHandler(
              new Error("TABLE_NOT_FOUND", "Unknown table " + table)
            );
          }
        }
      }
    ),
};

const query = (query, callback) => {
  const pool = connection();
  if (pool) {
    pool.query(query, callback);
  } else {
    errorHandler(new Error("NO_POOL", 'Unable to connect. Try "dmc config".'));
  }
};
