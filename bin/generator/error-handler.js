import { ConsoleWrite } from "../../utils/console-write.js";
import { COMMANDS } from "../commands/commands.js";

export function errorHandler(err) {
  if (err.code) {
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      ConsoleWrite.error(
        "Cannot access to database. Try " +
          ConsoleWrite.commandFormat(COMMANDS.CONFIG) +
          ' command. Or "dmc --help" for more information.'
      );
    } else {
      if (err.message) {
        ConsoleWrite.error(err.message);
      } else {
        ConsoleWrite.error(err.code);
      }
    }
  } else {
    ConsoleWrite.error(err);
  }
}
