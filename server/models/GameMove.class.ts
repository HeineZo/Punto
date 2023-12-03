import { ResultSetHeader } from "mysql2";
import { getTimestamp } from "../../src/lib//utils";
import db from "../config/db";
import { Colors, Range } from "./type";

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
  public async save() {
    try {
      const [result] = await db.query(
        `INSERT INTO ${GameMove.tableName} SET ?`,
        this
      );
      this.id = (result as ResultSetHeader).insertId;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
