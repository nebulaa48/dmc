export const CASE_FORMAT = Object.freeze({
  FLATCASE: "flatcase", //flatcase
  PASCALCASE: "pascalcase", //PascalCase
  CAMELCASE: "camelcase", //camelCase
  SNAKECASE: "snakecase", //snake_case
  DASHCASE: "dashcase", //dash-case
  CONSTANTCASE: "constantcase", //CONSTANT_CASE
  PASCALSNAKECASE: "pascalsnakecase", //Pascal_Snake_Case
});

export const CASE_FORMAT_LIST = Object.values(CASE_FORMAT);

export const FILE_CASE_FORMAT_EXEMPLES = Object.freeze({
  [CASE_FORMAT.FLATCASE]: "myfile.txt",
  [CASE_FORMAT.PASCALCASE]: "MyFile.txt",
  [CASE_FORMAT.CAMELCASE]: "myFile.txt",
  [CASE_FORMAT.SNAKECASE]: "my_file.txt",
  [CASE_FORMAT.DASHCASE]: "my-file.txt",
  [CASE_FORMAT.CONSTANTCASE]: "MY_FILE.txt",
  [CASE_FORMAT.PASCALSNAKECASE]: "My_File.txt",
});
export const PROPERTY_CASE_FORMAT_EXEMPLES = Object.freeze({
  [CASE_FORMAT.FLATCASE]: "var myvar;",
  [CASE_FORMAT.PASCALCASE]: "var MyVar;",
  [CASE_FORMAT.CAMELCASE]: "var myVar;",
  [CASE_FORMAT.SNAKECASE]: "var my_var;",
  [CASE_FORMAT.DASHCASE]: "Not Available",
  [CASE_FORMAT.CONSTANTCASE]: "var MY_VAR;",
  [CASE_FORMAT.PASCALSNAKECASE]: "var My_Var;",
});
