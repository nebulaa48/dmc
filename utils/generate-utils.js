import { existsSync, mkdirSync } from "fs";

function formatFileName(fileName, format) {}

function formatProperty(format) {}

function setOutputFolder(path, errorHandler) {
  try {
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  } catch (err) {
    errorHandler(err);
  }
}
