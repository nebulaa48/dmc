import { Config } from "../bin/entities/config.js";
import { parse } from "./json-utils.js";

export const CONFIG_FILE_NAME = "dmc-config.json";

export function getConfig() {
  const config = parse("../"+CONFIG_FILE_NAME);
  if (config) return Config.fromJSON(config);

  return null;
}
