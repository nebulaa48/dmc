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
        describe: "Host",
      },
      dbUser: {
        type: "input",
        describe: "User",
      },
      dbPassword: {
        type: "password",
        describe: "Password",
      },
    })
    .then((result) => {
      try {
        const { dbHost, dbUser, dbPassword } = result;
        const { config } = new LinkConfig(dbHost, dbUser, dbPassword);
        
        const content = config.map((c) => c[0] + "=" + c[1] + "\n").join("");

        writeFileSync(".env", content);

        callback("Link - ok.");
      } catch (err) {
        errorHandler(err);
      }
    });
}
