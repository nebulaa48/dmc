#! /usr/bin/env node

import { CASE_FORMAT, CASE_FORMAT_LIST } from "./entities/case-format.js";
import { hideBin } from "yargs/helpers";
import { commandHandler } from "./yargs/command-handler.js";
import { commandBuilder } from "./yargs/command-builder.js";
import y from "yargs";

const yargs = y(hideBin(process.argv));

yargs
  .scriptName("model-generator")
  .usage("$0 <cmd> [args]")
  .command("*", "", {}, (args) => commandHandler(yargs, args))
  .command("link", "To link DMC to a MySQL server", {}, (args) =>
    commandHandler(yargs, args)
  )
  .command(
    "gdb",
    "Generate Files Models From Database",
    commandBuilder,
    (args) => commandHandler(yargs, args)
  )
  .command(
    "gt [table]",
    "Generate File Model From A Specific Table",
    (yargs) => {
      yargs.positional("table", {
        type: "string",
        describe: "Table name",
        demandOption: yargs.demandOption("table"),
      });
      commandBuilder(yargs);
    },
    (args) => commandHandler(yargs, args)
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
    type: "array",
    alias: "format",
    default: [CASE_FORMAT.DASHCASE, CASE_FORMAT.CAMELCASE],
    choices: CASE_FORMAT_LIST,
    describe: "Set Case Format for file name and file properties",
  })
  .option("fi", {
    type: "boolean",
    alias: "format-infos",
    describe: "Give Case Format Infos And Exemples",
  })
  .strict()
  .help().argv;
