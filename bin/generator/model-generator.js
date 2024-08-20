import { hideBin } from "yargs/helpers";
import y from "yargs";

import { COMMANDS } from "../commands/commands.js";
import { OPTIONS } from "../options/options.js";

export function modelGenerator() {
  const yargs = y(hideBin(process.argv));
  const {
    GLOBAL,
    CONFIG,
    GENERATE_ALL_MODELS: GDB,
    GENERATE_MODEL_FROM_TABLE: GT,
  } = COMMANDS;
  const { TS, P, F, FI, CI } = OPTIONS;

  yargs
    .usage("$0 <cmd> [args]")
    .command(GLOBAL.command, GLOBAL.description, GLOBAL.builder, GLOBAL.handler)
    .command(CONFIG.command, CONFIG.description, CONFIG.builder, CONFIG.handler)
    .command(GDB.command, GDB.description, GDB.builder, GDB.handler)
    .command(GT.command, GT.description, GT.builder, GT.handler)
    .option(TS.key, TS.options)
    .option(P.key, P.options)
    .option(F.key, F.options)
    .option(FI.key, FI.options)
    .option(CI.key, CI.options)
    .strict()
    .help().argv;
}
