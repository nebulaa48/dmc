import { readFileSync } from "fs";
import boxen from "boxen";
import colors from "colors";
import chalk from "chalk";

const { version } = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url))
);

export function welcome() {
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
        chalk.dim('"dmc link"') +
        " to begin."
    )
  );
}
