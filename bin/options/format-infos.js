import chalk from "chalk";
import Table from "cli-table";
import {
  CASE_FORMAT_LIST,
  FILE_CASE_FORMAT_EXEMPLES,
  PROPERTY_CASE_FORMAT_EXEMPLES,
} from "../entities/case-format.js";

export const formatInfos = () => {
  var table = new Table({
    head: [chalk.bold.white("Format Option"), chalk.bold.white("Exemple")],
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
    ...CASE_FORMAT_LIST.map((c) => [
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

  console.log(
    'You can change the case format for the file generation by add "-f [file-format] [property-format]" to the "dmc gdb" or "dmc gt" command.'
  );
  console.log("Here a list of each case format available with exemples :");

  console.log(table.toString());
}
