export function errorHandler(yargs, err) {
  if (err.code) {
    console.log(err.code);
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.log(
        'Cannot access to database. Try "dmc link" command. Or "dmc --help" for more information.'
      );
    } else {
      if (err.message) {
        console.log(err.message);
      } else {
        console.log(err.code);
      }
    }
  } else {
    console.log(err);
  }
  yargs.exit();
}
