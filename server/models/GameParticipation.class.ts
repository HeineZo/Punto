import { ResultSetHeader } from "mysql2";
import Game from "./Game.class";
import Player from "./Player.class";
import { getTimestamp } from "../../src/lib//utils";
import {
  MySQLConnection,
  Neo4JConnection,
  SQLiteConnection,
} from "../config/db";

/**
 * Classe représentant une participation d'un joueur dans une partie
 */
export default class GameParticipation {
  public static tableName = "GameParticipation";
  /**
   * Identifiant de la participation d'un joueur dans une partie
   */
  public id: number;

  /**
   * Identifiant de la partie à laquelle le joueur participe
   */
  public idGame: number;

  /**
   * Identifiant du joueur qui participe à la partie
   */
  public idPlayer: number;

  /**
   * Nombre de cartes posées par le joueur dans la partie
   */
  public nbMove: number = 0;

  /**
   * Date à laquelle le joueur a participé à la partie
   */
  public createdAt: number = getTimestamp();

  constructor(init: Partial<GameParticipation>) {
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
  public static rowToObject(rows): GameParticipation[] {
    if (rows) {
      return rows.map((row) => new GameParticipation(row));
    }
    return [];
  }

  /**
   * Renvoi les données au client
   * @returns Données de la classe avec des informations supplémentaires
   */
  public async toClient() {
    const game = await Game.find(this.idGame);
    const player = await Player.find(this.idPlayer);
    return {
      id: this.id,
      game: game ? game.toClient() : null,
      player: player ? player.toClient() : null,
      nbMove: this.nbMove,
      createdAt: this.createdAt,
    };
  }

  /**
   * Sauvegarde la participation d'un joueur à une partie dans la base de donnée
   */
  public async save() {
    let result;
    const { id, ...rest } = this;
    try {
      switch (global.databaseType) {
        case "mysql":
          [result] = await MySQLConnection.query(
            `INSERT INTO ${GameParticipation.tableName} SET ?`,
            this
          );
          this.id = (result as ResultSetHeader).insertId;
          break;
        case "sqlite":
          result = SQLiteConnection.prepare(
            `INSERT INTO ${GameParticipation.tableName}(idGame, idPlayer, nbMove, createdAt) VALUES (?, ?, ?, ?)`
          ).run(Object.values(rest));
          this.id = result.lastInsertRowid;
          break;
        case "mongodb":
          // return await this.saveMongoDB();
          break;
        case "neo4j":
          result = await Neo4JConnection.run(
            `MATCH (p:Player), (g:Game) WHERE p.id = $idPlayer AND g.id = $idGame CREATE (p)-[participation:HAS_PLAYED]->(g) 
            RETURN id(participation) as participationId`,
            {
              idPlayer: this.idPlayer,
              idGame: this.idGame,
            }
          );
          this.id = result.records[0].get("participationId");
          break;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Récupère le nombre de joueurs dans une partie
   * @param id Identifiant de la partie
   * @returns Nombre de joueurs ayant participé à la partie
   */
  public static async getNbParticipation(id: number) {
    let rows;
    try {
      switch (global.databaseType) {
        case "mysql":
          [rows] = await MySQLConnection.query(
            `SELECT COUNT(*) as nbParticipation FROM ${this.tableName} WHERE idGame = ?`,
            [id]
          );
          return rows[0].nbParticipation;
        case "sqlite":
          rows = SQLiteConnection.prepare(
            `SELECT COUNT(*) as nbParticipation FROM ${this.tableName} WHERE idGame = ?`
          ).get(id);
          return rows.nbParticipation;
        case "mongodb":
        // return await this.findAllMongoDB();
      }
    } catch (err) {
      console.error(err);
      return 0;
    }
  }

  /**
   * Récupère les joueurs ayant participé à une partie
   * @param id Identifiant de la partie dont on veut récupérer les joueurs
   * @returns Joueurs trouvés
   */
  public static async getPlayers(id: number): Promise<Player[]> {
    let rows;
    try {
      switch (global.databaseType) {
        case "mysql":
          [rows] = await MySQLConnection.query(
            `SELECT * FROM ${this.tableName}, ${Player.tableName} 
            WHERE ${this.tableName}.idPlayer = ${Player.tableName}.id 
            AND idGame = ?`,
            [id]
          );
          break;
        case "sqlite":
          rows = SQLiteConnection.prepare(
            `SELECT * FROM ${this.tableName}, ${Player.tableName} 
            WHERE ${this.tableName}.idPlayer = ${Player.tableName}.id 
            AND idGame = ?`
          ).all(id);
          break;
        case "mongodb":
        // return await this.findAllMongoDB();
      }
    } catch (err) {
      console.error(err);
      return [];
    }
    return Player.rowToObject(rows);
  }

  /**
   * Récupère les participations à une partie
   * @param id Identifiant de la partie
   * @returns Participations trouvées
   */
  public static async findFromGame(id: number): Promise<GameParticipation[]> {
    let rows;
    try {
      switch (global.databaseType) {
        case "mysql":
          [rows] = await MySQLConnection.query(
            `SELECT * FROM ${this.tableName} WHERE idGame = ?`,
            [id]
          );
          break;
        case "sqlite":
          rows = SQLiteConnection.prepare(
            `SELECT * FROM ${this.tableName} WHERE idGame = ?`
          ).all(id);
          break;
        case "mongodb":
        // return await this.findAllMongoDB();
      }
    } catch (err) {
      console.error(err);
      return [];
    }
    return GameParticipation.rowToObject(rows);
  }
}
