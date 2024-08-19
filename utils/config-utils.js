import { Config } from "../bin/entities/config.js";
import { parse } from "./json-utils.js";

export function getConfig() {
  const config = parse("../dmc-config.json");

  return Config.fromJSON(config);
}
