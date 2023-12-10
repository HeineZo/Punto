import { ResultSetHeader } from "mysql2";
import { getTimestamp } from "../../src/lib//utils";
import { MySQLConnection, Neo4JConnection, SQLiteConnection } from "../config/db";

/**
 * Classe représentant un joueur
 */
export default class Player {
  public static tableName = "Player";
  /**
   * Identifiant du joueur
   */
  public id: number;

  /**
   * Pseudo du joueur
   */
  public pseudo: string;

  /**
   * Nombre de cartes posées par le joueur toute partie confondue
   */
  public nbMove: number;

  /**
   * Nombre de victoires du joueur
   */
  public nbVictory: number;

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt: number = getTimestamp();

  constructor(init: Partial<Player>) {
    Object.keys(init).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        (this as typeof init)[key] = init[key];
      }
    });
  }

  /**
   * Map les données récupérées de la base de donnée et les transforme en objet
   * @param rows Données récupérées de la base de donnée
   */
  public static rowToObject(rows) {
    if (rows) {
      return rows.map((row) => new Player(row));
    }
    return [];
  }

  /**
   * Renvoi les données au client
   * @returns Données de la classe avec des informations supplémentaires
   */
  public toClient() {
    return {
      id: this.id,
      pseudo: this.pseudo,
      nbMove: this.nbMove,
      nbVictory: this.nbVictory,
      createdAt: this.createdAt,
    };
  }

  /**
   * Sauvegarde le joueur dans la base de donnée
   */
  public async save() {
    let result;
    const { id, ...rest } = this;
    try {
      switch (global.databaseType) {
        case "mysql":
          [result] = await MySQLConnection.query(
            `INSERT INTO ${Player.tableName} SET ?`,
            this
          );
          this.id = (result as ResultSetHeader).insertId;
          break;
        case "sqlite":
          result = SQLiteConnection.prepare(
            `INSERT INTO ${Player.tableName}(pseudo, nbMove, nbVictory, createdAt) VALUES (?, ?, ?, ?)`
          ).run(Object.values(rest));
          this.id = result.lastInsertRowid;
          break;
        case "mongodb":
          // result = await db.collection(Player.tableName).insertOne(this);
          break;
        case "neo4j":
          result = await Neo4JConnection.run(
            `CREATE (p:Player {pseudo: $pseudo, nbMove: $nbMove, nbVictory: $nbVictory, createdAt: $createdAt}) 
              RETURN id(p) as playerId`,
            rest
          );
          this.id = result.records[0].get("playerId");
          break;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Met à jour le joueur dans la base de donnée
   * @returns True si le joueur a été modifié, false sinon
   */
  public async update() {
    try {
      switch (global.databaseType) {
        case "mysql":
          await MySQLConnection.query(
            `UPDATE ${Player.tableName} SET ? WHERE id = ?`,
            [this, this.id]
          );
          break;
        case "sqlite":
          SQLiteConnection.prepare(
            `UPDATE ${Player.tableName} SET pseudo = ?, nbMove = ?, nbVictory = ?, createdAt = ? WHERE id = ?`
          ).run(this, this.id);
          break;
        case "mongodb":
          // await db.collection(Player.tableName).updateOne({ id: this.id }, { $set: this });
          break;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Cherche un joueur à partir de son identifiant
   * @param id Identifiant du joueur
   * @returns Joueur trouvé
   */
  public static async find(id: number): Promise<Player | null> {
    let rows;
    try {
      switch (global.databaseType) {
        case "mysql":
          [rows] = await MySQLConnection.query(
            `SELECT * FROM ${this.tableName} WHERE id = ?`,
            [id]
          );
          break;
        case "sqlite":
          rows = SQLiteConnection.prepare(
            `SELECT * FROM ${this.tableName} WHERE id = ?`
          ).all(id);
          break;
        case "mongodb":
          // rows = await db.collection(this.tableName).findOne({ id });
          break;
      }
      return this.rowToObject(rows)[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
