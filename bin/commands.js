const fs = require("fs");
const colors = require("colors");
const chalk = require("chalk");
const manipulations = require("./db-manipulations");
const ora = require("ora");
const yargsInteractive = require("yargs-interactive");
const { version } = require("../package.json");
const { capitalizeFirstLetter } = require("../utils/string-utils");
const { SQL_TO_TS } = require("../utils/sql-data-type-conversion");

function welcome() {
  console.log(
    chalk.bold(colors.rainbow("WELCOME TO DMC [Database Model CLI] !!")) +
      chalk.italic(" (Version : " + version + ")")
  );
  console.log(
    'Type "dmc --help" for more information OR try "dmc link" to begin.'
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
        fs.writeFileSync(".env", content);
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
    manipulations.checkIfDBexists(
      dbName,
      () => {
        manipulations.multipleTablesDesc(
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
    manipulations.checkIfDBexists(
      dbName,
      () => {
        manipulations.tableDesc(
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
    fs.writeFileSync(path + "/" + tableName + ".js", content);
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
    fs.writeFileSync(path + "/" + tableName + ".ts", content);
    return tableName + " - ok.";
  } catch (err) {
    handleError(err);
  }
}

function setOutputFolder(path, handleError) {
  try {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  } catch (err) {
    handleError(err);
  }
}

module.exports = {
  welcome,
  generateModelsFromDatabase,
  generateModelFromTable,
  link,
};
