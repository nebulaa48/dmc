import { existsSync, readFileSync } from "fs";
import { errorHandler } from "../bin/generator/error-handler.js";

export function parse(path) {
  try {
    const url = new URL(path, import.meta.url);
    if (existsSync(url)) {
      return JSON.parse(readFileSync(url));
    }
    return null;
  } catch (err) {
    errorHandler(err);
  }
}
