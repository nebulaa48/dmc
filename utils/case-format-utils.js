import { CASE_FORMAT } from "../bin/entities/case-format.js";
import {
  capitalizeFirstLetter,
  normalize,
  removeSpecialChar,
  removeSuccessiveSpecialChar,
  replaceSpecial,
  trimSpecialChar,
} from "./string-utils.js";

export function formatCase(str, format) {
  const normalizedStr = removeSpecialChar(normalize(str));
  const caseFormat = CASE_FORMAT_FN[format];
  const formatted = caseFormat
    ? trimSpecialChar(removeSuccessiveSpecialChar(caseFormat(normalizedStr)))
    : normalizedStr;
  return formatted;
}

export function formatToCamelcase(str) {
  const formatted = replaceSpecial(str, "$");
  const split = formatted.split("$");
  const camel = split.reduce((accumulator, currentValue, index) => {
    if (index === 1) {
      accumulator = accumulator.toLowerCase();
    }
    return accumulator + capitalizeFirstLetter(currentValue);
  });
  return camel;
}
export function formatToConstantcase(str) {
  return formatToSnakecase(str).toUpperCase();
}
export function formatToDashcase(str) {
  return replaceSpecial(str, "-");
}
export function formatToFlatcase(str) {
  return replaceSpecial(str, "").toLowerCase();
}
export function formatToPascalcase(str) {
  const formatted = replaceSpecial(str, "$");
  const split = formatted.split("$");

  if (split.length > 1) {
    return split.reduce(
      (accumulator, currentValue) =>
        capitalizeFirstLetter(accumulator) + capitalizeFirstLetter(currentValue)
    );
  }

  return capitalizeFirstLetter(split[0]);
}
export function formatToPascalsnakecase(str) {
  const formatted = formatToSnakecase(str);
  const split = formatted.split("_");
  if (split.length > 1) {
    return split.reduce(
      (accumulator, currentValue) =>
        capitalizeFirstLetter(accumulator) +
        "_" +
        capitalizeFirstLetter(currentValue)
    );
  }

  return capitalizeFirstLetter(split[0]);
}
export function formatToSnakecase(str) {
  return replaceSpecial(str, "_");
}

const CASE_FORMAT_FN = Object.freeze({
  [CASE_FORMAT.FLATCASE]: formatToFlatcase,
  [CASE_FORMAT.PASCALCASE]: formatToPascalcase,
  [CASE_FORMAT.CAMELCASE]: formatToCamelcase,
  [CASE_FORMAT.SNAKECASE]: formatToSnakecase,
  [CASE_FORMAT.DASHCASE]: formatToDashcase,
  [CASE_FORMAT.CONSTANTCASE]: formatToConstantcase,
  [CASE_FORMAT.PASCALSNAKECASE]: formatToPascalsnakecase,
});
