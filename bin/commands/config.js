import yargsInteractive from "yargs-interactive";
import { writeFileSync } from "fs";
import { Config } from "../entities/config.js";
import { errorHandler } from "../generator/error-handler.js";
import { CONFIG_FILE_NAME, getConfig } from "../../utils/config-utils.js";
import { ConsoleWrite } from "../../utils/console-write.js";

export function config(argv) {
  const c = getConfig();

  if (c) {
    ConsoleWrite.message(
      'A config already exists for database "' + c.dbName + '"'
    );
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
  ConsoleWrite.message(
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
          ConsoleWrite.message('\n')
          ConsoleWrite.info("Missing Database Name.\n");
          retry();
        } else {
          const config = new Config(dbHost, dbPort, dbName, dbUser, dbPassword);

          const content = JSON.stringify(config);

          writeFileSync(CONFIG_FILE_NAME, content);

          ConsoleWrite.message("Config - ok.");
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
        ConsoleWrite.message("\n");
        interactiveConfig(argv);
      }
    });
};
