import db from "../config/db.js";
import GameParticipation from "./GameParticipation.class.js";
import Player from "./Player.class.js";

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
   * Nombre de cartes posées par tous les joueurs dans la partie
   */
  public nbMove: number;

  /**
   * Nombre de manches pour gagner la partie
   */
  public nbRound: number;

  /**
   * Temps qu'a duré la partie
   */
  public duration: number;

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt: Date;

  constructor(data: Game) {
    const { id, duration, idWinner, nbMove, nbRound, createdAt } = data;
    this.id = id;
    this.idWinner = idWinner;
    this.nbMove = nbMove;
    this.nbRound = nbRound;
    this.duration = duration;
    this.createdAt = new Date(createdAt);
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
    return {
      id: this.id,
      winner: winner ? winner.toClient() : null,
      nbMove: this.nbMove,
      nbRound: this.nbRound,
      duration: this.duration,
      nbPlayer,
      createdAt: this.createdAt,
    };
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
