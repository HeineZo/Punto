import { ResultSetHeader } from "mysql2";
import db from "../config/db";
import Game from "./Game.class";
import Player from "./Player.class";
import { getTimestamp } from "../../src/lib//utils";

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
    return rows.map((row) => new GameParticipation(row));
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
    try {
      const [result] = await db.query(
        `INSERT INTO ${GameParticipation.tableName} SET ?`,
        this
      );
      this.id = (result as ResultSetHeader).insertId;
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
    const [rows] = await db.query(
      `SELECT COUNT(*) as nbParticipation FROM ${this.tableName} WHERE idGame = ?`,
      [id]
    );
    return rows[0].nbParticipation;
  }

  /**
   * Récupère les joueurs ayant participé à une partie
   * @param id Identifiant de la partie dont on veut récupérer les joueurs
   * @returns Joueurs trouvés
   */
  public static async getPlayers(id: number): Promise<Player[]> {
    const [rows] = await db.query(
      `SELECT * FROM ${this.tableName}, ${Player.tableName} 
        WHERE ${this.tableName}.idPlayer = ${Player.tableName}.id 
        AND idGame = ?`,
      [id]
    );
    return Player.rowToObject(rows);
  }

  /**
   * Récupère les participations à une partie
   * @param id Identifiant de la partie
   * @returns Participations trouvées
   */
  public static async findFromGame(id: number): Promise<GameParticipation[]> {
    const [rows] = await db.query(
      `SELECT * FROM ${this.tableName}
      WHERE idGame = ?`,
      [id]
    );
    return GameParticipation.rowToObject(rows);
  }
}
