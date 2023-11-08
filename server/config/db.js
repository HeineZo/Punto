/* eslint-env node */
import { createConnection } from "mysql";
import "dotenv/config";

const db = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default db;
