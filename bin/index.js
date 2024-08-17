#! /usr/bin/env node
import { CASE_FORMAT, CASE_FORMAT_LIST } from "./case-format.js";
import { welcome, generateModelsFromDatabase, generateModelFromTable, link } from "./commands.js";
import yargs from "yargs";

yargs().scriptName("model-generator")
  .usage("$0 <cmd> [args]")
  .command("*", "", {}, commandHandler)
  .command("link", "To link DMC to a MySQL server", {}, commandHandler)
  .command(
    "gdb [database]",
    "Generate Files Models From Database",
    builder,
    commandHandler
  )
  .command(
    "gt [database] [table]",
    "Generate File Model From A Specific Table",
    (yargs) => {
      yargs.positional("table", {
        type: "string",
        describe: "Table name",
        demandOption: yargs.demandOption("table"),
      });
      builder(yargs);
    },
    commandHandler
  )
  .option("ts", {
    type: "boolean",
    alias: "typescript",
    describe: "Generate TS files",
  })
  .option("p", {
    type: "string",
    alias: "path",
    default: "./models",
    describe: "Set Output Path",
  })
  .option("f", {
    type: "string",
    alias: "format",
    default: CASE_FORMAT.FLATCASE,
    choices: CASE_FORMAT_LIST,
    describe: "Set Case Format",
  })
  .option("fi", {
    type: "boolean",
    alias: "format-infos",
    describe: "Give Case Format Infos And Exemples",
  })
  .strict()
  .help().argv;

function builder(yargs) {
  yargs.positional("database", {
    type: "string",
    describe: "Database name",
    demandOption: yargs.demandOption("database"),
  });
}
function commandHandler(argv) {
  const arg = argv._[0];

  if (!arg) {
    welcome();
  }

  if (arg === "gdb") {
    generateModelsFromDatabase(
      argv.database,
      argv.ts,
      argv.path,
      (result) => {
        console.log(result);
        yargs.exit();
      },
      handleError
    );
  }

  if (arg === "gt") {
    generateModelFromTable(
      argv.database,
      argv.table,
      argv.ts,
      argv.path,
      (result) => {
        console.log(result);
        yargs.exit();
      },
      handleError
    );
  }

  if (arg === "link") {
    link((result) => {
      console.log(result);
      yargs.exit();
    }, handleError);
  }
}

function handleError(err) {
  if (err.code) {
    console.log(err.code);
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.log(
        'Cannot access to database. Try "dmc link" command. Or "dmc --help" for more information.'
      );
    } else {
      if (err.message) {
        console.log(err.message);
      } else {
        console.log(err.code);
      }
    }
  } else {
    console.log(err);
  }
  yargs.exit();
}
