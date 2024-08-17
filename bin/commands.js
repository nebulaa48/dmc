import { DB_MANIPULATION } from "./db-manipulations.js";
import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFile,
  readFileSync,
} from "fs";
import { capitalizeFirstLetter } from "../utils/string-utils.js";
import { SQL_TO_TS } from "../utils/sql-data-type-conversion.js";
import ora from "ora";
import boxen from "boxen";
import yargsInteractive from "yargs-interactive";
import colors from "colors";
import chalk from "chalk";
const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url))
);

function welcome() {
  console.log("\n");
  console.log(
    boxen(
      chalk.bold(colors.rainbow("WELCOME TO DMC [Database Model CLI] !!")),
      {
        title: chalk.italic("Version : " + version + ""),
        padding: 1,
        margin: 1,
        borderStyle: "double",
      }
    )
  );
  console.log(
    chalk.bold(
      "Type " +
        chalk.dim('"dmc --help"') +
        " for more information OR try " +
        chalk.dim('"dmc link"') +
        " to begin."
    )
  );
}

function link(callback, handleError) {
  yargsInteractive()
    .usage("$0 <command> [args]")
    .interactive({
      interactive: { default: true },
      dbHost: {
        type: "input",
        describe: "Host",
      },
      dbUser: {
        type: "input",
        describe: "User",
      },
      dbPassword: {
        type: "password",
        describe: "Password",
      },
    })
    .then((result) => {
      try {
        const { dbHost, dbUser, dbPassword } = result;
        const content = `HOST=${dbHost}\nUSER=${dbUser}\nPASSWORD=${dbPassword}`;
        writeFileSync(".env", content);
        callback("Link - ok.");
      } catch (err) {
        handleError(err);
      }
    });
}

function generateModelsFromDatabase(
  dbName,
  ts = false,
  path,
  callback,
  handleError
) {
  const spinner = ora("Generate files\n").start();
  const timeout = setTimeout(() => {
    DB_MANIPULATION.checkIfDBexists(
      dbName,
      () => {
        DB_MANIPULATION.multipleTablesDesc(
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
                handleError
              );
            } else {
              callback(result);
            }
          },
          handleError
        );
      },
      handleError
    );
    clearTimeout(timeout);
  }, 2000);
}

function generateModelFromTable(
  dbName,
  table,
  ts = false,
  path,
  callback,
  handleError
) {
  const spinner = ora("Generate file\n").start();
  const timeout = setTimeout(() => {
    DB_MANIPULATION.checkIfDBexists(
      dbName,
      () => {
        DB_MANIPULATION.tableDesc(
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
                handleError
              );
            } else {
              callback(result);
            }
          },
          handleError
        );
      },
      handleError
    );
    clearTimeout(timeout);
  }, 2000);
}

function generateMultiple(
  dbName,
  tables,
  path,
  ts = false,
  callback,
  handleError
) {
  const tableNames = Object.keys(tables);
  setOutputFolder(path, handleError);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;
  try {
    const generated = [];
    for (const name of tableNames) {
      const generate = generateFn(dbName, tables[name], path, handleError);
      console.log(generate);
      generated.push(generate);
    }
    callback(generated.length + "/" + tableNames.length + " tables generated.");
  } catch (err) {
    handleError(err);
  }
}

function generateOne(
  dbName,
  colsInfos,
  path,
  ts = false,
  callback,
  handleError
) {
  setOutputFolder(path, handleError);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;

  try {
    const generate = generateFn(dbName, colsInfos, path, handleError);
    console.log(generate);
    callback("Table file generated.");
  } catch (err) {
    handleError(err);
  }
}

function generateFileModelJS(dbName, colsInfos, path, handleError) {
  try {
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
    handleError(err);
  }
}
function generateFileModelTS(dbName, colsInfos, path, handleError) {
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
    handleError(err);
  }
}

function setOutputFolder(path, handleError) {
  try {
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  } catch (err) {
    handleError(err);
  }
}

export { welcome, generateModelsFromDatabase, generateModelFromTable, link };
