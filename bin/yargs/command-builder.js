export function commandBuilder(yargs) {
  yargs.positional("database", {
    type: "string",
    describe: "Database name",
    demandOption: yargs.demandOption("database"),
  });
}
