import yargsInteractive from "yargs-interactive";
import { writeFileSync } from "fs";
import { Config } from "../entities/config.js";
import { errorHandler } from "../generator/error-handler.js";

export function config(argv) {
  yargsInteractive()
    .usage("$0 <command> [args]")
    .interactive({
      interactive: { default: true },
      dbHost: {
        type: "input",
        default: "localhost",
        describe: "Host",
        prompt: "always",
      },
      dbPort: {
        type: "number",
        default: 3306,
        describe: "Port",
        prompt: "always",
      },
      dbName: {
        type: "input",
        describe: "Database Name",
      },
      dbUser: {
        type: "input",
        describe: "User",
        default: "root",
        prompt: "always",
      },
      dbPassword: {
        type: "password",
        describe: "Password",
      },
    })
    .then((result) => {
      try {
        const { dbHost, dbPort, dbName, dbUser, dbPassword } = result;

        if (!dbName) {
          console.log("\nMissing Database Name.\n");
          retry();
        } else {
          const config = new Config(dbHost, dbPort, dbName, dbUser, dbPassword);

          const content = JSON.stringify(config);

          writeFileSync("dmc-config.json", content);

          callback("Config - ok.");
        }
      } catch (err) {
        errorHandler(err);
      }
    });
}

const retry = (argv) => {
  yargsInteractive()
    .usage("$0 <command> [args]")
    .interactive({
      interactive: { default: true },
      retry: {
        type: "confirm",
        describe: "Retry ?",
      },
    })
    .then((result) => {
      if (result.retry) {
        console.log("\n");
        config(argv);
      }
    });
};
