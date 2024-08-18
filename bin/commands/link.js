import yargsInteractive from "yargs-interactive";
import { writeFileSync } from "fs";
import { LinkConfig } from "../entities/link-config.js";

export function link(callback, errorHandler) {
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
          retry(callback, errorHandler);
        } else {
          const { config } = new LinkConfig(
            dbHost,
            dbPort,
            dbName,
            dbUser,
            dbPassword
          );

          const content = config.map((c) => c[0] + "=" + c[1] + "\n").join("");

          writeFileSync(".env", content);

          callback("Link - ok.");
        }
      } catch (err) {
        errorHandler(err);
      }
    });
}

const retry = (callback, errorHandler) => {
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
        link(callback, errorHandler);
      }
    });
};
