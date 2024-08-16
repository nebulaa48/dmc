const conversion = new Map();

// STRING DATA TYPES
conversion.set("CHAR", "string");
conversion.set("VARCHAR", "string");
conversion.set("BINARY", "string");
conversion.set("VARBINARY", "string");
conversion.set("TINYBLOB", "string");
conversion.set("TINYTEXT", "string");
conversion.set("TEXT", "string");
conversion.set("BLOB", "string");
conversion.set("MEDIUMTEXT", "string");
conversion.set("MEDIUMBLOB", "string");
conversion.set("LONGTEXT", "string");
conversion.set("LONGBLOB", "string");
conversion.set("ENUM", "string[]");
conversion.set("SET", "string[]");

//DATE AND TIME DATA TYPES
conversion.set("DATE", "Date");
conversion.set("DATETIME", "Date");
conversion.set("TIMESTAMP", "Date");
conversion.set("TIME", "Date");
conversion.set("YEAR", "number");

//NUMERIC DATA TYPES
conversion.set("BIT", "number");
conversion.set("TINYINT", "number");
conversion.set("BOOL", "boolean");
conversion.set("BOOLEAN", "boolean");
conversion.set("SMALLINT", "number");
conversion.set("MEDIUMINT", "number");
conversion.set("INT", "number");
conversion.set("INTEGER", "number");
conversion.set("BIGINT", "bigint");
conversion.set("FLOAT", "number");
conversion.set("FLOAT", "number");
conversion.set("DOUBLE", "number");
conversion.set("DOUBLE PRECISION", "number");
conversion.set("DECIMAL", "number");
conversion.set("DEC", "number");

module.exports = {SQL_TO_TS : conversion}
