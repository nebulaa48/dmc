import chalk from "chalk";
import {
  CASE_FORMAT_LIST,
  FILE_CASE_FORMAT_EXEMPLES,
  PROPERTY_CASE_FORMAT_EXEMPLES,
} from "../entities/case-format.js";
import { ConsoleWrite } from "../../utils/console-write.js";
import { COMMANDS } from "../commands/commands.js";

export const formatInfos = () => {
  ConsoleWrite.message(
    "You can change the case format for the file generation by adding " +
      chalk.bold.dim.italic("-f [file-format] [property-format]") +
      " to the " +
      ConsoleWrite.commandFormat(COMMANDS.GENERATE_ALL_MODELS) +
      " or " +
      ConsoleWrite.commandFormat(COMMANDS.GENERATE_MODEL_FROM_TABLE) +
      " command."
  );
  ConsoleWrite.message(
    "\nHere a list of each case format available with exemples :"
  );

  ConsoleWrite.table(
    ["Format Option", "Exemple"],
    CASE_FORMAT_LIST.map((c) => [
      c,
      chalk.italic(
        FILE_CASE_FORMAT_EXEMPLES[c] +
          " - " +
          (PROPERTY_CASE_FORMAT_EXEMPLES[c] === "Not Available"
            ? chalk.strikethrough(PROPERTY_CASE_FORMAT_EXEMPLES[c])
            : PROPERTY_CASE_FORMAT_EXEMPLES[c])
      ),
    ])
  );
};
