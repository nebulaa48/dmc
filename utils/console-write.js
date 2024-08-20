import chalk from "chalk";
import Table from "cli-table";
import { TABLE_CHARS } from "../bin/entities/table-chars.js";

export class ConsoleWrite {
  static message(message) {
    console.log(message);
  }
  static info(message) {
    console.log(chalk.bold(chalk.bgCyan("INFO") + " -> " + message));
  }
  static error(message) {
    console.log(chalk.bold(chalk.bgRed("ERROR") + " -> " + message));
  }
  static table(head, data) {
    var table = new Table({
      head: head.map((h) => chalk.bold.white(h)),
      chars: TABLE_CHARS,
    });
    table.push(...data);

    console.log(table.toString());
  }

  static commandFormat(command) {
    return chalk.bold(chalk.dim('"' + command.fullCommand + '"'));
  }
}
