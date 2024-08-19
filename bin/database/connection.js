import { createPool } from "mysql";
import { getConfig } from "../../utils/config-utils.js";

const CONFIG = getConfig();

export const connection = createPool({
  host: CONFIG.dbHost,
  user: CONFIG.dbUser,
  password: CONFIG.dbPassword,
  database: CONFIG.dbName,
  port: CONFIG.dbPort,
});
