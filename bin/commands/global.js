import { OPTIONS } from "../options/options.js";
import { COMMANDS } from "./commands.js";
import boxen from "boxen";
import colors from "colors";
import chalk from "chalk";
import { parse } from "../../utils/json-utils.js";

export function global(argv) {
  const arg = argv._[0];

  if (!arg) {
    if (argv[OPTIONS.FI.key]) {
      OPTIONS.FI.action();
    } else {
      welcome();
    }
  }
}

function welcome() {
  const { version } = parse("../package.json");

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
        chalk.dim('"dmc ' + COMMANDS.CONFIG.command + '"') +
        " to begin."
    )
  );
}
