import yargsInteractive from "yargs-interactive";
import { writeFileSync } from "fs";
import { Config } from "../entities/config.js";
import { errorHandler } from "../generator/error-handler.js";
import { getConfig } from "../../utils/config-utils.js";

export function config(argv) {
  const c = getConfig();

  if (c) {
    console.log('A config already exists for database "' + c.dbName + '"');
    yargsInteractive()
      .interactive({
        interactive: { default: true },
        overwrite: {
          type: "confirm",
          describe: "Would you like to overwrite config ?",
        },
      })
      .then((result) => {
        if (result.overwrite) {
          description();
          interactiveConfig(argv);
        }
      });
  } else {
    description();
    interactiveConfig(argv);
  }
}

const description = () => {
  console.log(
    "You will need to answer a few questions in order to connect DMC to the required database..."
  );
};
const interactiveConfig = (argv) => {
  yargsInteractive()
    .interactive({
      interactive: { default: true },
      dbHost: {
        type: "input",
        default: "localhost",
        describe: "Database Host",
        prompt: "always",
      },
      dbPort: {
        type: "number",
        default: 3306,
        describe: "Database Port",
        prompt: "always",
      },
      dbName: {
        type: "input",
        describe: "Database Name",
      },
      dbUser: {
        type: "input",
        describe: "Database User",
        default: "root",
        prompt: "always",
      },
      dbPassword: {
        type: "password",
        describe: "Database Password",
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

          console.log("Config - ok.");
        }
      } catch (err) {
        errorHandler(err);
      }
    });
};
const retry = (argv) => {
  yargsInteractive()
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
        interactiveConfig(argv);
      }
    });
};
