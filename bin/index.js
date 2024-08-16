#! /usr/bin/env node

const commands = require("./commands");
const yargs = require("yargs");

yargs
  .scriptName("model-generator")
  .usage("$0 <cmd> [args]")
  .command("link", "To link DMC to a MySQL server", {}, handler)
  .command(
    "gdb [database]",
    "Generate Files Models From Database",
    builder,
    handler
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
    handler
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

  .strict()
  .help().argv;

function builder(yargs) {
  yargs.positional("database", {
    type: "string",
    describe: "Database name",
    demandOption: yargs.demandOption("database"),
  });
}
function handler(argv) {
  const arg = argv._[0];

  if (arg === "gdb") {
    console.log("DATABASE GENERATOR");
    commands.generateModelsFromDatabase(
      argv.database,
      argv.ts,
      argv.path,
      (result) => {
        console.log(result);
        console.log("GENERATION ENDED");
        yargs.exit();
      }
    );
  }

  if (arg === "gt") {
    console.log("TABLE GENERATOR");
    commands.generateModelFromTable(
      argv.database,
      argv.table,
      argv.ts,
      argv.path,
      (result) => {
        console.log(result);
        console.log("GENERATION ENDED");
        yargs.exit();
      }
    );
  }

  if (arg === "link") {
    commands.link((result) => {
      console.log(result);
      yargs.exit();
    });
  }
}
