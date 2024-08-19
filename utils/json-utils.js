import { readFileSync } from "fs";

export function parse(path) {
  return JSON.parse(readFileSync(new URL(path, import.meta.url)));
}
