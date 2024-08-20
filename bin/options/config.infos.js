import chalk from "chalk";
import Table from "cli-table";
import { getConfig } from "../../utils/config-utils.js";
import { Config } from "../entities/config.js";

export const configInfos = () => {
  const config = getConfig();

  if (config) {
    var table = new Table({
      head: [chalk.bold.white("Parameter"), chalk.bold.white("Value")],
      chars: {
        top: "═",
        "top-mid": "╤",
        "top-left": "╔",
        "top-right": "╗",
        bottom: "═",
        "bottom-mid": "╧",
        "bottom-left": "╚",
        "bottom-right": "╝",
        left: "║",
        "left-mid": "╟",
        mid: "─",
        "mid-mid": "┼",
        right: "║",
        "right-mid": "╢",
        middle: "│",
      },
    });
    table.push(
      ...Object.entries(config).map((c) => [
        "Database " + c[0].split("db")[1],
        c[1] ? c[1] : chalk.italic("empty"),
      ])
    );
    console.log("Actual Config :\n");
    console.log(table.toString());
  } else {
    console.log('There is no config. You can set one with "dmc config".');
  }
};
