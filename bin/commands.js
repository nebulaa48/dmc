const fs = require("fs");
const yargsInteractive = require("yargs-interactive");
const manipulations = require("./db-manipulations");
const { capitalizeFirstLetter } = require("../utils/string-utils");
const { SQL_TO_TS } = require("../utils/sql-data-type-conversion");

function link(callback) {
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
        console.log(err);
      }
    });
}

function generateModelsFromDatabase(dbName, ts = false, path, callback) {
  manipulations.multipleTablesDesc(dbName, (result) => {
    const rows = result;
    if (rows && rows.length > 0) {
      const tables = rows.reduce((tables, row) => {
        (tables[row.table] = tables[row.table] || []).push(row);
        return tables;
      }, {});
      generateMultiple(dbName, tables, path, ts, callback);
    } else {
      callback(result);
    }
  });
}

function generateModelFromTable(dbName, table, ts = false, path, callback) {
  manipulations.tableDesc(dbName, table, (result) => {
    const rows = result;
    if (rows && rows.length > 0) {
      generateOne(dbName, rows, path, ts, callback);
    } else {
      callback(result);
    }
  });
}

function generateMultiple(dbName, tables, path, ts = false, callback) {
  const tableNames = Object.keys(tables);
  setOutputFolder(path);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;
  try {
    const results = [];
    for (const name of tableNames) {
      const generate = generateFn(dbName, tables[name], path);
      results.push(generate);
    }
    callback(results.join("\n"));
  } catch (err) {
    console.log(err);
  }
}

function generateOne(dbName, colsInfos, path, ts = false, callback) {
  setOutputFolder(path);

  const generateFn = ts ? generateFileModelTS : generateFileModelJS;

  try {
    const generate = generateFn(dbName, colsInfos, path);
    callback(generate);
  } catch (err) {
    console.log(err);
  }
}

function generateFileModelJS(dbName, colsInfos, path) {
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
    console.log(err);
  }
}
function generateFileModelTS(dbName, colsInfos, path) {
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
    console.log(err);
  }
}

function setOutputFolder(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

module.exports = {
  generateModelsFromDatabase,
  generateModelFromTable,
  link,
};
