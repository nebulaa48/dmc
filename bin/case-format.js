const CASE_FORMAT = Object.freeze({
  FLATCASE: "flatcase", //flatcase
  PASCALCASE: "pascalcase", //PascalCase
  CAMELCASE: "camelcase", //camelCase
  SNAKECASE: "snakecase", //snake_case
  DASHCASE: "dashcase", //dash-case
  CONSTANTCASE: "constantcase", //CONSTANT_CASE
  PASCALSNAKECASE: "pascalsnakecase", //Pascal_Snake_Case
});

const CASE_FORMAT_LIST = Object.values(CASE_FORMAT);

module.exports = { CASE_FORMAT, CASE_FORMAT_LIST };
