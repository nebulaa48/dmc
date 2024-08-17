import { config } from "dotenv";
import { createPool } from "mysql";

config();

export const connection = createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
});

