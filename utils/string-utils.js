function capitalizeFirstLetter(str) {
  console.log(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function replaceSpecialChar(str, replaceValue) {
  return str.replace(/[^a-zA-Z0-9-_. ]/g, replaceValue);
}

function removeSpecialChar(str) {
  return replaceSpecialChar(str, "").replace(/ +(?= )/g, "");
}

function trimSpecialChar(str) {
  return str.replace(/^[-_. ]|[-_. ]$/g, "");
}

function removeSuccessiveSpecialChar(str) {
  return str.replace(/([-_. ]+)(?=[-_. ]*\1)/g, "");
}

function replaceSpecial(str, char) {
  return str.replace(/[-_. ]/g, char);
}

export {
  capitalizeFirstLetter,
  normalize,
  replaceSpecial,
  removeSpecialChar,
  removeSuccessiveSpecialChar,
  trimSpecialChar,
};
