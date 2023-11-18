import db from "../config/db.js";
import { randomInt } from "crypto";
import { error, router } from "../index.js";
import { Player } from "./Player.class.js";

/**
 * Classe représentant une partie
 */
export default class Game {
  /**
   * Identifiant de la partie
   */
  public id: number;

  /**
   * Gagnant de la partie
   */
  public winner: Player;

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
  public createdAt: number;

  constructor(data: Game) {
    const { id, duration, winner, nbMove, nbRound, createdAt } = data;
    this.id = id;
    this.winner = new Player(winner);
    this.nbMove = nbMove;
    this.nbRound = nbRound;
    this.duration = duration;
    this.createdAt = createdAt;
  }

  /**
   * Map les données récupérées de la base de donnée et les transforme en objet
   * @param rows Données récupérées de la base de donnée
   */
  public static rowToObject(rows) {
    return rows.map((gameData) => new Game(gameData));
  }

  /**
   * Retourne toutes les parties
   */
  public static async findAll() {
    try {
      const [rows] = await db.query("SELECT * FROM Game");
      return this.rowToObject(rows);
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
