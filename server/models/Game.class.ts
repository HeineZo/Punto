/* eslint-disable no-case-declarations */
import { ResultSetHeader } from "mysql2";
import GameParticipation from "./GameParticipation.class.js";
import Player from "./Player.class.js";
import { getTimestamp } from "../../src/lib//utils.js";
import {
  MySQLConnection,
  SQLiteConnection,
  MongoGame,
  Neo4JConnection,
} from "../config/db.js";

/**
 * Classe représentant une partie
 */
export default class Game {
  public static tableName = "Game";
  /**
   * Identifiant de la partie
   */
  public id: number;

  /**
   * Gagnant de la partie
   */
  public idWinner: number;

  /**
   * Nombre de joueurs dans la partie
   */
  public nbPlayer: number;

  /**
   * Nombre de cartes posées par tous les joueurs dans la partie
   */
  public nbMove: number = 0;

  /**
   * Nombre de manches pour gagner la partie
   */
  public nbRound: number;

  /**
   * Temps qu'a duré la partie
   */
  public duration: number = 0;

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt: number = getTimestamp();

  constructor(init: Partial<Game>) {
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
  public static rowToObject(rows): Game[] {
    if (rows) {
      return rows.map((row) => new Game(row));
    }
    return [];
  }

  /**
   * Renvoi les données au client
   * @returns Données de la classe avec des informations supplémentaires
   */
  public async toClient() {
    const winner = await Player.find(this.idWinner);
    const nbPlayer = await GameParticipation.getNbParticipation(this.id);
    const players = await GameParticipation.getPlayers(this.id);
    return {
      id: this.id,
      winner: winner ? winner.toClient() : null,
      nbMove: this.nbMove,
      nbRound: this.nbRound,
      duration: this.duration,
      nbPlayer,
      players,
      createdAt: this.createdAt,
    };
  }

  /**
   * Sauvegarde la partie dans la base de donnée
   * @returns True si la partie a été sauvegardée, false sinon
   */
  public async save() {
    let result;
    const { id, ...rest } = this;
    try {
      switch (global.databaseType) {
        case "mysql":
          [result] = await MySQLConnection.query(
            `INSERT INTO ${Game.tableName} SET ?`,
            this
          );
          this.id = (result as ResultSetHeader).insertId;
          break;
        case "sqlite":
          result = SQLiteConnection.prepare(
            `INSERT INTO ${Game.tableName}(idWinner, nbPlayer, nbMove, nbRound, duration, createdAt) VALUES (?, ?, ?, ?, ?, ?)`
          ).run(Object.values(rest));
          this.id = result.lastInsertRowid;
          break;
        case "mongodb":
          break;
        case "neo4j":
          result = await Neo4JConnection.run(
            `CREATE (g:Game {nbPlayer: $nbPlayer, nbMove: $nbMove, nbRound: $nbRound, duration: $duration, createdAt: $createdAt}) 
            RETURN id(g) as gameId`,
            rest
          );
          this.id = result.records[0].get("gameId");
          break;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Met à jour la partie dans la base de donnée
   * @returns True si la partie a été mise à jour, false sinon
   */
  public async update() {
    const { id, ...rest } = this;
    try {
      switch (global.databaseType) {
        case "mysql":
          await MySQLConnection.query(
            `UPDATE ${Game.tableName} SET ? WHERE id = ?`,
            [this, this.id]
          );
          break;
        case "sqlite":
          SQLiteConnection.prepare(
            `UPDATE ${Game.tableName} SET idWinner = ?, nbPlayer = ?, nbMove = ?, nbRound = ?, duration = ?, createdAt = ? WHERE id = ?`
          ).run(Object.values(rest), id);
          break;
        case "mongodb":
        // return await this.updateMongoDB();
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Retourne toutes les parties
   */
  public static async findAll() {
    let rows;
    try {
      switch (global.databaseType) {
        case "mysql":
          [rows] = await MySQLConnection.query(
            `SELECT * FROM ${this.tableName}`
          );
          break;
        case "sqlite":
          rows = SQLiteConnection.prepare(
            `SELECT * FROM ${this.tableName}`
          ).all();
          break;
        case "mongodb":
          break;
      }
      return this.rowToObject(rows);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  /**
   * Cherche une partie à partir de son identifiant
   * @param id Identifiant de la partie
   * @returns Partie trouvée
   */
  public static async find(id: number): Promise<Game | null> {
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
        // return await this.findAllMongoDB();
      }
      return this.rowToObject(rows)[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
