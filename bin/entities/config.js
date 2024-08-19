export class Config {
  constructor(dbHost, dbPort, dbName, dbUser, dbPassword) {
    this.dbHost = dbHost;
    this.dbPort = dbPort;
    this.dbName = dbName;
    this.dbUser = dbUser;
    this.dbPassword = dbPassword;
  }

  static fromJSON(json) {
    return new this(
      json.dbHost,
      json.dbPort,
      json.dbName,
      json.dbUser,
      json.dbPassword
    );
  }
}
