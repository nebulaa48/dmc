import { DB } from "../database/db-manipulations.js";
import { formatCase } from "../../utils/case-format-utils.js";
import { capitalizeFirstLetter } from "../../utils/string-utils.js";
import { SQL_TO_TS } from "../entities/sql-data-type-conversion.js";
import { writeFileSync } from "fs";
import ora from "ora";
import { generateFile, setOutputFolder } from "../../utils/generate-utils.js";
import { CASE_FORMAT } from "../entities/case-format.js";

export function generateAllModels(
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
      DB.multipleTablesDesc((result) => {
        const rows = result;
        if (rows && rows.length > 0) {
          const tables = rows.reduce((tables, row) => {
            (tables[row.table] = tables[row.table] || []).push(row);
            return tables;
          }, {});
          generateMultiple(
            tables,
            path,
            ts,
            format,
            (result) => {
              callback(result);
              spinner.stop();
            },
            errorHandler
          );
        } else {
          callback(result);
        }
      }, errorHandler);
      clearTimeout(timeout);
    }, 2000);
  } else {
    callback(formatCheck.message);
  }
}

export function generateModelFromTable(
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
      DB.tableDesc(
        table,
        (result) => {
          const rows = result;
          if (rows && rows.length > 0) {
            generateOne(
              rows,
              path,
              ts,
              format,
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
      clearTimeout(timeout);
    }, 1000);
  } else {
    callback(formatCheck.message);
  }
}

const generateMultiple = (
  tables,
  path,
  ts = false,
  format,
  callback,
  errorHandler
) => {
  const tableNames = Object.keys(tables);
  setOutputFolder(path, errorHandler);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;
  try {
    const generated = [];
    for (const name of tableNames) {
      const generate = generateFn(tables[name], path, format, errorHandler);
      console.log(generate);
      generated.push(generate);
    }
    callback(generated.length + "/" + tableNames.length + " tables generated.");
  } catch (err) {
    errorHandler(err);
  }
};

const generateOne = (
  colsInfos,
  path,
  ts = false,
  format,
  callback,
  errorHandler
) => {
  setOutputFolder(path, errorHandler);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;

  try {
    const generate = generateFn(colsInfos, path, format, errorHandler);
    console.log(generate);
    callback("Table file generated.");
  } catch (err) {
    errorHandler(err);
  }
};

const generateFileModelJS = (colsInfos, path, format, errorHandler) => {
  try {
    console.log(format);
    const tableName = colsInfos[0].table;
    const columns = colsInfos.map((p) => formatCase(p.column, format[1]));
    const content = `//GENERATED TABLE MODEL FOR TABLE ${tableName} FROM DATABASE ${
      process.env.DB_NAME
    }\n\nclass ${formatCase(tableName, CASE_FORMAT.PASCALCASE)} {\n${columns
      .map((c) => "  " + c + ";\n")
      .join("")}\n  constructor(${columns.join(", ")}) {\n${columns
      .map((c) => "\t\tthis." + c + " = " + c + ";\n")
      .join("")}  }\n}
                  `;
    generateFile(content, path, formatCase(tableName, format[0]), ".js");
    return tableName + " - ok.";
  } catch (err) {
    errorHandler(err);
  }
};
const generateFileModelTS = (colsInfos, path, format, errorHandler) => {
  try {
    const tableName = colsInfos[0].table;
    const columns = colsInfos.map((p) => ({
      col: formatCase(p.column, format[1]),
      type: SQL_TO_TS.get(p.type.toUpperCase()),
      nullable: p.nullable === "YES",
    }));
    const ptypes = columns.map(
      (c) => c.col + ": " + c.type + (c.nullable ? " | null" : "")
    );

    const content = `//GENERATED TABLE MODEL FOR TABLE ${tableName} FROM DATABASE ${
      process.env.DB_NAME
    }\n\nclass ${formatCase(tableName, CASE_FORMAT.PASCALCASE)} {\n${ptypes
      .map((t) => "  " + t + ";\n")
      .join("")}\n  constructor(${ptypes.join(", ")}) {\n${columns
      .map((c) => "\t\tthis." + c.col + " = " + c.col + ";\n")
      .join("")}  }\n}
                    `;
    generateFile(content, path, formatCase(tableName, format[0]), ".ts");
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
