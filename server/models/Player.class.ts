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

  constructor(data: Player) {
    const { id, pseudo, password, nbMove, nbVictory, nbDefeat, createdAt } =
      data;
    this.id = id;
    this.pseudo = pseudo;
    this.nbMove = nbMove;
    this.password = password;
    this.nbVictory = nbVictory;
    this.nbDefeat = nbDefeat;
    this.createdAt = createdAt;
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
