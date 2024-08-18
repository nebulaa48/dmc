import { connection } from "./connection.js";
import Error from "../entities/error.js";

export const DB = {
  multipleTablesDesc: (callback, errorHandler) =>
    connection.query(
      "SELECT TABLE_NAME as 'table', COLUMN_NAME as 'column', DATA_TYPE as 'type', IS_NULLABLE as 'nullable', COLUMN_KEY as 'key_type', COLUMN_DEFAULT as 'default', EXTRA as 'extra' from information_schema.COLUMNS WHERE TABLE_SCHEMA='" +
        process.env.DB_NAME +
        "'; ",
      function (err, result) {
        if (err) {
          errorHandler(err);
        } else {
          if (result.length > 0) {
            callback(result);
          } else {
            errorHandler(
              new Error("EMPTY_DB", process.env.DB_NAME + " is empty.")
            );
          }
        }
      }
    ),
  tableDesc: (table, callback, errorHandler) =>
    connection.query(
      "SELECT TABLE_NAME as 'table', COLUMN_NAME as 'column', DATA_TYPE as 'type', IS_NULLABLE as 'nullable', COLUMN_KEY as 'key_type', COLUMN_DEFAULT as 'default', EXTRA as 'extra' from information_schema.COLUMNS WHERE TABLE_SCHEMA='" +
        process.env.DB_NAME +
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
