function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalize(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export { capitalizeFirstLetter, normalize };
