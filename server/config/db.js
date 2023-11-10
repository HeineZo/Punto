/* eslint-env node */
import 'dotenv/config';
import { createConnection } from "mysql2/promise";

const db = await createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "test",
  password: process.env.DB_PASSWORD || "test",
  database: process.env.DB_NAME ||"punto",
});

export default db;