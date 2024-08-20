import { DB } from "../database/db-manipulations.js";
import { formatCase } from "../../utils/case-format-utils.js";
import { SQL_TO_TS } from "../entities/sql-data-type-conversion.js";
import ora from "ora";
import { generateFile, setOutputFolder } from "../../utils/generate-utils.js";
import { CASE_FORMAT } from "../entities/case-format.js";
import { getConfig } from "../../utils/config-utils.js";
import { errorHandler } from "../generator/error-handler.js";
import { ConsoleWrite } from "../../utils/console-write.js";
import { COMMANDS } from "./commands.js";

export function generate(argv, fromTable = false) {
  const config = getConfig();

  if (config) {
    const dbName = config.dbName;
    if (fromTable) {
      generateModelFromTable(argv, dbName);
    } else {
      generateAllModels(argv, dbName);
    }
  } else {
    ConsoleWrite.info(
      "No configuration found. Try " +
        ConsoleWrite.commandFormat(COMMANDS.CONFIG) +
        "."
    );
  }
}

function generateAllModels(argv, dbName) {
  const { ts, format, path } = argv;
  const formatCheck = checkFormatOption(format);
  if (formatCheck.ok) {
    const spinner = ora("Generate files\n").start();
    const timeout = setTimeout(() => {
      DB.multipleTablesDesc(dbName, (result) => {
        const rows = result;
        if (rows && rows.length > 0) {
          const tables = rows.reduce((tables, row) => {
            (tables[row.table] = tables[row.table] || []).push(row);
            return tables;
          }, {});
          generateMultiple(dbName, tables, path, ts, format, (result) => {
            ConsoleWrite.message(result);
            spinner.stop();
          });
        } else {
          ConsoleWrite.message(result);
        }
      });
      clearTimeout(timeout);
    }, 2000);
  } else {
    ConsoleWrite.error(formatCheck.message);
  }
}

function generateModelFromTable(argv, dbName) {
  const { table, ts, format, path } = argv;
  const formatCheck = checkFormatOption(format);
  if (formatCheck.ok) {
    const spinner = ora("Generate file\n").start();
    const timeout = setTimeout(() => {
      DB.tableDesc(dbName, table, (result) => {
        const rows = result;
        if (rows && rows.length > 0) {
          generateOne(dbName, rows, path, ts, format, (result) => {
            ConsoleWrite.message(result);
            spinner.stop();
          });
        } else {
          ConsoleWrite.message(result);
        }
      });
      clearTimeout(timeout);
    }, 1000);
  } else {
    ConsoleWrite.error(formatCheck.message);
  }
}

const generateMultiple = (
  dbName,
  tables,
  path,
  ts = false,
  format,
  callback
) => {
  const tableNames = Object.keys(tables);
  setOutputFolder(path);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;
  try {
    const generated = [];
    for (const name of tableNames) {
      const generate = generateFn(dbName, tables[name], path, format);
      ConsoleWrite.message(generate);
      generated.push(generate);
    }
    callback(generated.length + "/" + tableNames.length + " tables generated.");
  } catch (err) {
    errorHandler(err);
  }
};

const generateOne = (dbName, colsInfos, path, ts = false, format, callback) => {
  setOutputFolder(path);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;

  try {
    const generate = generateFn(dbName, colsInfos, path, format);
    ConsoleWrite.message(generate);
    callback("Table file generated.");
  } catch (err) {
    errorHandler(err);
  }
};

const generateFileModelJS = (dbName, colsInfos, path, format) => {
  try {
    const tableName = colsInfos[0].table;
    const columns = colsInfos.map((p) => formatCase(p.column, format[1]));
    const content = `//GENERATED TABLE MODEL FOR TABLE ${tableName} FROM DATABASE ${dbName}\n\nclass ${formatCase(
      tableName,
      CASE_FORMAT.PASCALCASE
    )} {\n${columns
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
const generateFileModelTS = (dbName, colsInfos, path, format) => {
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

    const content = `//GENERATED TABLE MODEL FOR TABLE ${tableName} FROM DATABASE ${dbName}\n\nclass ${formatCase(
      tableName,
      CASE_FORMAT.PASCALCASE
    )} {\n${ptypes
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
