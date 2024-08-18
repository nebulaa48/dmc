export class LinkConfig {
  constructor(dbHost, dbUser, dbPassword) {
    const values = [dbHost, dbUser, dbPassword];
    this.config = [...LINK_KEYS.map((p, index) => [p, values[index]])];
  }
}
const LINK_KEYS = Object.freeze(["DB_HOST", "DB_USER", "DB_PASSWORD"]);
