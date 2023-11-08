/* eslint-env node */
import { createConnection } from "mysql";
const db = createConnection({
  host: "localhost",
  user: "test",
  password: "test",
  database: "punto",
});

export default db;
