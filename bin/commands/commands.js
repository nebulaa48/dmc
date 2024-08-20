import { config } from "./config.js";
import { generate } from "./generate.js";
import { Command } from "../entities/command.js";
import { global } from "./global.js";

const GENERATE_ALL_MODELS = new Command(
  "gdb",
  "Generate Files Models From Database",
  (argv) => generate(argv)
);
const GENERATE_MODEL_FROM_TABLE = new Command(
  "gt [table]",
  "Generate File Model From A Specific Table",
  (argv) => generate(argv, true),
  (yargs) => {
    yargs.positional("table", {
      type: "string",
      describe: "Table name",
      demandOption: yargs.demandOption("table"),
    });
  }
);

export const CONFIG = new Command(
  "config",
  "To link DMC to a Database",
  config
);

export const GLOBAL = new Command("*", "", global);

export const COMMANDS = {
  GENERATE_ALL_MODELS,
  GENERATE_MODEL_FROM_TABLE,
  CONFIG,
  GLOBAL,
};
