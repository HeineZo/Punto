/* eslint-env node */
import "dotenv/config";
import { createConnection } from "mysql2/promise";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import neo4j from "neo4j-driver";

/**
 * Lis un fichier
 * @param pathdir Chemin vers le fichier
 * @returns Contenu du fichier
 */
export async function readFile(pathdir) {
  try {
    const sql = fs.readFileSync(path.resolve(path.resolve(), pathdir), "utf8");
    return sql;
  } catch (error) {
    console.error("Erreur lors de la lecture du fichier:", error);
    return null;
  }
}

/**
 * Crée des connexions aux bases de données
 */
// MySQL
export const MySQLConnection = await createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
// SQLite
export const SQLiteConnection = new Database("punto.db");
// Neo4J
export const Neo4JDriver = neo4j.driver(
  process.env.NEO4J_URL,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

try {
  await Neo4JDriver.executeQuery("CREATE DATABASE Punto IF NOT EXISTS");
  console.log("Base de donnée Neo4J créée avec succès");
} catch (error) {
  console.error("Erreur lors de la création de la base de donnée Neo4J:", error);
}
export const Neo4JConnection = Neo4JDriver.session({ database: "Punto" });
// export const MongoConnection = await mongoose.connect(process.env.MONGO_URL);

// Création des tables si elles n'existent pas
// const mysqlFile = await readFile("./server/config/mysql.sql");
// if (!mysqlFile) {
//   console.error(
//     "Impossible de trouver le fichier MySQL ou le fichier est vide"
//   );
// }
// try {
//   await MySQLConnection.execute(mysqlFile);
//   console.log("Tables MySQL créées avec succès");
// } catch (error) {
//   console.error("Erreur lors de la création des tables MySQL", error);
// }

/**
 * Crée une connexion à la base de données SQLite
 */
// Création des tables si elles n'existent pas
const sqliteFile = await readFile("./server/config/sqlite.sql");
if (!sqliteFile) {
  console.error(
    "Impossible de trouver le fichier SQLite ou le fichier est vide"
  );
}

try {
  await SQLiteConnection.exec(sqliteFile);
  console.log("Tables SQLite créées avec succès");
} catch (error) {
  console.error("Erreur lors de la création des tables SQLite: ", error);
}

// const Schema = mongoose.Schema;
// const Player = new Schema({
//   pseudo: String,
//   nbMove: Number,
//   nbVictory: Number,
// })

// const Game = new Schema({
//   winner: Player,
//   nbPlayer: Number,
//   players: [Player],
//   nbMove: Number,
//   moves: [],
//   duration: Number,
//   nbRound: Number,
//   date: Date
// });

// export const MongoPlayer = mongoose.model('Player', Player);
// export const MongoGame = mongoose.model('Game', Game);