import { config } from "./config.js";
import { generateModelFromTable, generateAllModels } from "./generate.js";
import { Command } from "../entities/command.js";
import { global } from "./global.js";

const GENERATE_ALL_MODELS = new Command(
  "gdb",
  "Generate Files Models From Database",
  generateAllModels
);
const GENERATE_MODEL_FROM_TABLE = new Command(
  "gt [table]",
  "Generate File Model From A Specific Table",
  generateModelFromTable,
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
  "To link DMC to a MySQL server",
  config
);

export const GLOBAL = new Command("*", "", global);

export const COMMANDS = {
  GENERATE_ALL_MODELS,
  GENERATE_MODEL_FROM_TABLE,
  CONFIG,
  GLOBAL,
};
