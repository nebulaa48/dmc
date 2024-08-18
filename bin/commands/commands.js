import { formatInfos } from "./format-infos.js";
import { welcome } from "./welcome.js";
import { link } from "./link.js";
import { generateModelsFromDatabase, generateModelFromTable } from "./generate.js";

export const COMMANDS = {
  formatInfos,
  welcome,
  link,
  generateModelsFromDatabase,
  generateModelFromTable,
};
