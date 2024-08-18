export class LinkConfig {
  constructor(dbHost, dbPort, dbName, dbUser, dbPassword) {
    const values = [dbHost, dbPort, dbName, dbUser, dbPassword];
    this.config = [...LINK_KEYS.map((p, index) => [p, values[index]])];
  }
}
const LINK_KEYS = Object.freeze([
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
]);
