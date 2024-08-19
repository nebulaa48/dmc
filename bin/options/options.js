import { CASE_FORMAT, CASE_FORMAT_LIST } from "../entities/case-format.js";
import { Option } from "../entities/option.js";
import { formatInfos } from "./format-infos.js";

const TS = new Option("ts", {
  type: "boolean",
  alias: "typescript",
  describe: "Generate TS files",
});
const P = new Option("p", {
  type: "string",
  alias: "path",
  default: "./models",
  describe: "Set Output Path",
});
const F = new Option("f", {
  type: "array",
  alias: "format",
  default: [CASE_FORMAT.DASHCASE, CASE_FORMAT.CAMELCASE],
  choices: CASE_FORMAT_LIST,
  describe: "Set Case Format for file name and file properties",
});
const FI = new Option(
  "fi",
  {
    type: "boolean",
    alias: "format-infos",
    describe: "Give Case Format Infos And Exemples",
  },
  formatInfos
);

export const OPTIONS = {
  TS,
  P,
  F,
  FI,
};
