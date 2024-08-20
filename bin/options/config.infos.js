import chalk from "chalk";
import { getConfig } from "../../utils/config-utils.js";
import { ConsoleWrite } from "../../utils/console-write.js";
import { COMMANDS } from "../commands/commands.js";

export const configInfos = () => {
  const config = getConfig();

  if (config) {
    ConsoleWrite.message("Actual Config :");
    ConsoleWrite.table(
      ["Parameter", "Value"],
      Object.entries(config).map((c) => [
        "Database " + c[0].split("db")[1],
        c[1] ? c[1] : chalk.italic("empty"),
      ])
    );
  } else {
    ConsoleWrite.message(
      "There is no config. You can set one with " +
        ConsoleWrite.commandFormat(COMMANDS.CONFIG) +
        "."
    );
  }
};
