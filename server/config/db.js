/* eslint-env node */
import 'dotenv/config';
import { createConnection } from "mysql2/promise";

const db = await createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.on('error', (err) => {
  console.error('MySQL error', err);
  db.end();
});

export default db;