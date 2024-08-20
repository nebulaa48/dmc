import { createPool } from "mysql";
import { getConfig } from "../../utils/config-utils.js";

export const connection = () => {
  const config = getConfig();
  if (config) {
    return createPool({
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      port: config.dbPort,
    });
  }
  return null;
};
