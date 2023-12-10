import { ResultSetHeader } from "mysql2";
import { getTimestamp } from "../../src/lib//utils";
import { Colors, Range } from "./type";
import { MySQLConnection, Neo4JConnection, SQLiteConnection } from "../config/db";
import GameParticipation from "./GameParticipation.class";

/**
 * Carte posée par un joueur dans une partie
 */
export default class GameMove {
  public static tableName = "GameMove";
  /**
   * Identifiant de la carte qui a été jouée
   */
  public id: number;

  /**
   * Identifiant de la participation du joueur qui a joué la carte dans une partie
   */
  public idParticipation: number;

  /**
   * Couleur de la carte
   */
  public color: Colors;

  /**
   * Valeur de la carte
   */
  public value: Range<1, 9>;

  /**
   * Position horizontale de la carte sur le plateau
   */
  public rowPosition: Range<1, 7>;

  /**
   * Position verticale de la carte sur le plateau
   */
  public colPosition: Range<1, 7>;

  /**
   * Date à laquelle la carte a été jouée
   */
  public createdAt: number = getTimestamp();

  constructor(init: Partial<GameMove>) {
    Object.assign(this, init);
  }

  /**
   * Renvoi les données au client
   * @returns Données de la classe avec des informations supplémentaires
   */
  public async toClient() {
    return this;
  }

  /**
   * Sauvegarde le coup joué dans la base de donnée
   */
  public async save(participation?: GameParticipation) {
    let result;
    const { id, ...rest } = this;
    try {
      switch (global.databaseType) {
        case "mysql":
          [result] = await MySQLConnection.query(
            `INSERT INTO ${GameMove.tableName} SET ?`,
            this
          );
          break;
        case "sqlite":
          result = SQLiteConnection.prepare(
            `INSERT INTO ${GameMove.tableName}(idParticipation, color, value, rowPosition, colPosition, createdAt) VALUES (?, ?, ?, ?, ?, ?)`
          ).run(Object.values(rest));
          break;
        case "mongodb":
          break;
        case "neo4j":
          result = await Neo4JConnection.run(
            `MATCH (p:Player {id: $playerId})-[participation:PARTICIPATES_IN]->(g:Game {id: $gameId})
            CREATE (c:Card {color: $color, value: $value})
            CREATE (p)-[move:PLAYS {rowPosition: $row, colPosition: $col}]->(c)`,
            {
              playerId: participation?.idPlayer,
              gameId: participation?.idGame,
              color: this.color,
              value: this.value,
              row: this.rowPosition,
              col: this.colPosition
            }
          );
          break;
      }
      this.id = (result as ResultSetHeader).insertId;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
