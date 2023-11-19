import { ResultSetHeader } from "mysql2";
import db from "../config/db";

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
   * Mot de passe du joueur
   */
  public password: string;

  /**
   * Nombre de cartes posées par le joueur toute partie confondue
   */
  public nbMove: number;

  /**
   * Nombre de victoires du joueur
   */
  public nbVictory: number;

  /**
   * Nombre de défaites du joueur
   */
  public nbDefeat: number;

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt: number;

  constructor(init: Partial<Player>) {
    Object.assign(this, init);
  }

  /**
   * Map les données récupérées de la base de donnée et les transforme en objet
   * @param rows Données récupérées de la base de donnée
   */
  public static rowToObject(rows) {
    return rows.map((row) => new Player(row));
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
      nbDefeat: this.nbDefeat,
      createdAt: this.createdAt,
    };
  }

  /**
   * Sauvegarde le joueur dans la base de donnée
   */
  public async save() {
    try {
      const [insertedPlayer] = await db.query(
        `INSERT INTO ${Player.tableName} (pseudo, password) VALUES (?, ?)`,
        [this.pseudo, this.password]
      );
      this.id = (insertedPlayer as ResultSetHeader).insertId;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Cherche un joueur à partir de son identifiant
   * @param id Identifiant du joueur
   * @returns Joueur trouvé
   */
  public static async find(id: number): Promise<Player | null> {
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
