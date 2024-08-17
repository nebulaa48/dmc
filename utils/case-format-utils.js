import { CASE_FORMAT } from "../bin/case-format";

export function formatCase(str, format) {
  const caseFormat = CASE_FORMAT_FN[format];
  return caseFormat ? caseFormat(str) : str;
}

export function formatToCamelcase(str) {}
export function formatToConstantcase(str) {}
export function formatToDashcase(str) {}
export function formatToFlatcase(str) {}
export function formatToPascalcase(str) {}
export function formatToPascalsnakecase(str) {}
export function formatToSnakecase(str) {}

const CASE_FORMAT_FN = Object.freeze({
  [CASE_FORMAT.FLATCASE]: formatToFlatcase,
  [CASE_FORMAT.PASCALCASE]: formatToPascalcase,
  [CASE_FORMAT.CAMELCASE]: formatToCamelcase,
  [CASE_FORMAT.SNAKECASE]: formatToSnakecase,
  [CASE_FORMAT.DASHCASE]: formatToDashcase,
  [CASE_FORMAT.CONSTANTCASE]: formatToConstantcase,
  [CASE_FORMAT.PASCALSNAKECASE]: formatToPascalsnakecase,
});
