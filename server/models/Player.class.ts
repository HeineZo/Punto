import { ResultSetHeader } from "mysql2";
import db from "../config/db";
import { getTimestamp } from "../../src/lib//utils";

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
      createdAt: this.createdAt,
    };
  }

  /**
   * Sauvegarde le joueur dans la base de donnée
   */
  public async save() {
    try {
      const [result] = await db.query(
        `INSERT INTO ${Player.tableName} SET ?`,
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
   * Met à jour le joueur dans la base de donnée
   * @returns True si le joueur a été modifié, false sinon
   */
  public async update() {
    try {
      await db.query(`UPDATE ${Player.tableName} SET ? WHERE id = ?`, [
        this,
        this.id,
      ]);
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
