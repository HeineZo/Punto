import { ResultSetHeader } from "mysql2";
import db from "../config/db.js";
import GameParticipation from "./GameParticipation.class.js";
import Player from "./Player.class.js";
import { getTimestamp } from "../../src/utils/utils.js";

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

  constructor(init?: Partial<Game>) {
    Object.assign(this, init);
  }

  /**
   * Map les données récupérées de la base de donnée et les transforme en objet
   * @param rows Données récupérées de la base de donnée
   */
  public static rowToObject(rows): Game[] {
    return rows.map((row) => new Game(row));
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
   */
  public async save() {
    try {
      const [result] = await db.query(
        `INSERT INTO ${Game.tableName} SET ?`,
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
   * Retourne toutes les parties
   */
  public static async findAll() {
    try {
      const [rows] = await db.query(`SELECT * FROM ${this.tableName}`);
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
    try {
      const [rows] = await db.query(
        `SELECT * FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      return this.rowToObject(rows)[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
