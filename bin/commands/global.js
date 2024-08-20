import { OPTIONS } from "../options/options.js";
import { COMMANDS } from "./commands.js";
import boxen from "boxen";
import colors from "colors";
import chalk from "chalk";
import { parse } from "../../utils/json-utils.js";
import { ConsoleWrite } from "../../utils/console-write.js";

export function global(argv) {
  const arg = argv._[0];

  if (!arg) {
    if (argv[OPTIONS.FI.key]) {
      OPTIONS.FI.action();
    } else if (argv[OPTIONS.CI.key]) {
      OPTIONS.CI.action();
    } else {
      welcome();
    }
  }
}

function welcome() {
  const p = parse("../package.json");

  const version = p?.version || "Unknow";

  ConsoleWrite.message("\n");
  ConsoleWrite.message(
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
  ConsoleWrite.message(
    chalk.bold(
      "Type " +
        chalk.dim('"dmc --help"') +
        " for more information OR try " +
        ConsoleWrite.commandFormat(COMMANDS.CONFIG) +
        " to begin."
    )
  );
}
