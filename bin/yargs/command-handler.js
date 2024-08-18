import { COMMANDS } from "../commands/commands.js";
import { errorHandler } from "./error-handler.js";

export function commandHandler(yargs, argv) {
  const arg = argv._[0];

  if (!arg) {
    if (argv.fi) {
      COMMANDS.formatInfos();
    } else {
      COMMANDS.welcome();
    }
  }

  if (arg === "gdb") {
    COMMANDS.generateModelsFromDatabase(
      argv.database,
      argv.ts,
      argv.f,
      argv.path,
      (result) => {
        console.log(result);
        yargs.exit();
      },

      (err) => errorHandler(yargs, err)
    );
  }

  if (arg === "gt") {
    COMMANDS.generateModelFromTable(
      argv.database,
      argv.table,
      argv.ts,
      argv.f,
      argv.path,
      (result) => {
        console.log(result);
        yargs.exit();
      },
      (err) => errorHandler(yargs, err)
    );
  }

  if (arg === "link") {
    COMMANDS.link(
      (result) => {
        console.log(result);
        yargs.exit();
      },
      (err) => errorHandler(yargs, err)
    );
  }
}
