import chalk from "chalk";
import Table from "cli-table";
import { getConfig } from "../../utils/config-utils.js";
import { TABLE_CHARS } from "../entities/table-chars.js";

export const configInfos = () => {
  const config = getConfig();

  if (config) {
    var table = new Table({
      head: [chalk.bold.white("Parameter"), chalk.bold.white("Value")],
      chars: TABLE_CHARS,
    });
    table.push(
      ...Object.entries(config).map((c) => [
        "Database " + c[0].split("db")[1],
        c[1] ? c[1] : chalk.italic("empty"),
      ])
    );
    console.log("Actual Config :");
    console.log(table.toString());
  } else {
    console.log('There is no config. You can set one with "dmc config".');
  }
};
