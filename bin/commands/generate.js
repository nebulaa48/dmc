import { DB } from "../database/db-manipulations.js";
import { formatCase } from "../../utils/case-format-utils.js";
import { capitalizeFirstLetter } from "../../utils/string-utils.js";
import { SQL_TO_TS } from "../entities/sql-data-type-conversion.js";
import { writeFileSync } from "fs";
import ora from "ora";

export function generateModelsFromDatabase(
  dbName,
  ts = false,
  format,
  path,
  callback,
  errorHandler
) {
  const formatCheck = checkFormatOption(format);
  if (formatCheck.ok) {
    const spinner = ora("Generate files\n").start();
    const timeout = setTimeout(() => {
      DB.checkIfDBexists(
        dbName,
        () => {
          DB.multipleTablesDesc(
            dbName,
            (result) => {
              const rows = result;
              if (rows && rows.length > 0) {
                const tables = rows.reduce((tables, row) => {
                  (tables[row.table] = tables[row.table] || []).push(row);
                  return tables;
                }, {});
                generateMultiple(
                  dbName,
                  tables,
                  path,
                  ts,
                  (result) => {
                    callback(result);
                    spinner.stop();
                  },
                  errorHandler
                );
              } else {
                callback(result);
              }
            },
            errorHandler
          );
        },
        errorHandler
      );
      clearTimeout(timeout);
    }, 2000);
  } else {
    callback(formatCheck.message);
  }
}

export function generateModelFromTable(
  dbName,
  table,
  ts = false,
  format,
  path,
  callback,
  errorHandler
) {
  const formatCheck = checkFormatOption(format);
  if (formatCheck.ok) {
    const spinner = ora("Generate file\n").start();
    const timeout = setTimeout(() => {
      DB.checkIfDBexists(
        dbName,
        () => {
          DB.tableDesc(
            dbName,
            table,
            (result) => {
              const rows = result;
              if (rows && rows.length > 0) {
                generateOne(
                  dbName,
                  rows,
                  path,
                  ts,
                  (result) => {
                    callback(result);
                    spinner.stop();
                  },
                  errorHandler
                );
              } else {
                callback(result);
              }
            },
            errorHandler
          );
        },
        errorHandler
      );
      clearTimeout(timeout);
    }, 2000);
  } else {
    callback(formatCheck.message);
  }
}

const generateMultiple = (
  dbName,
  tables,
  path,
  ts = false,
  callback,
  errorHandler
) => {
  const tableNames = Object.keys(tables);
  setOutputFolder(path, errorHandler);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;
  try {
    const generated = [];
    for (const name of tableNames) {
      const generate = generateFn(dbName, tables[name], path, errorHandler);
      console.log(generate);
      generated.push(generate);
    }
    callback(generated.length + "/" + tableNames.length + " tables generated.");
  } catch (err) {
    errorHandler(err);
  }
};

const generateOne = (
  dbName,
  colsInfos,
  path,
  ts = false,
  callback,
  errorHandler
) => {
  setOutputFolder(path, errorHandler);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;

  try {
    const generate = generateFn(dbName, colsInfos, path, errorHandler);
    console.log(generate);
    callback("Table file generated.");
  } catch (err) {
    errorHandler(err);
  }
};

const generateFileModelJS = (dbName, colsInfos, path, errorHandler) => {
  try {
    formatCase("ého");
    const tableName = colsInfos[0].table;
    const columns = colsInfos.map((p) => p.column);
    const content = `//GENERATED TABLE MODEL FOR TABLE ${tableName} FROM DATABASE ${dbName}\n\nclass ${capitalizeFirstLetter(
      tableName
    )} {\n${columns
      .map((c) => "  " + c + ";\n")
      .join("")}\n  constructor(${columns.join(", ")}) {\n${columns
      .map((c) => "\t\tthis." + c + " = " + c + ";\n")
      .join("")}  }\n}
                  `;
    writeFileSync(path + "/" + tableName + ".js", content);
    return tableName + " - ok.";
  } catch (err) {
    errorHandler(err);
  }
};
const generateFileModelTS = (dbName, colsInfos, path, errorHandler) => {
  try {
    const tableName = colsInfos[0].table;
    const columns = colsInfos.map((p) => ({
      col: p.column,
      type: SQL_TO_TS.get(p.type.toUpperCase()),
      nullable: p.nullable === "YES",
    }));
    const ptypes = columns.map(
      (c) => c.col + ": " + c.type + (c.nullable ? " | null" : "")
    );

    const content = `//GENERATED TABLE MODEL FOR TABLE ${tableName} FROM DATABASE ${dbName}\n\nclass ${capitalizeFirstLetter(
      tableName
    )} {\n${ptypes
      .map((t) => "  " + t + ";\n")
      .join("")}\n  constructor(${ptypes.join(", ")}) {\n${columns
      .map((c) => "\t\tthis." + c.col + " = " + c.col + ";\n")
      .join("")}  }\n}
                    `;
    writeFileSync(path + "/" + tableName + ".ts", content);
    return tableName + " - ok.";
  } catch (err) {
    errorHandler(err);
  }
};

const checkFormatOption = (format) => {
  if (format.length === 2) {
    return { ok: true };
  } else {
    return {
      ok: false,
      message:
        '"-format" option Need 2 arguments, recieved ' + format.length + ".",
    };
  }
};
