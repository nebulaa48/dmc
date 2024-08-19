import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { errorHandler } from "../bin/generator/error-handler.js";

export function setOutputFolder(path) {
  try {
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  } catch (err) {
    errorHandler(err);
  }
}

export function generateFile(content, path, fileName, ext) {
  const formattedPath =
    path[path.length - 1] === "/" ? path.slice(0, -1) : path;
  const formattedExt = ext[0] != "." ? "." + ext : ext;

  const filePath = formattedPath + "/" + fileName + formattedExt;
  try {
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
    writeFileSync(filePath, content);
  } catch (err) {
    errorHandler(err);
  }
}
