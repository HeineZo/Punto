import db from "../config/db";
import Game from "./Game.class";
import Player from "./Player.class";

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
  public nbMove: number;

  /**
   * Date à laquelle le joueur a participé à la partie
   */
  public createdAt: number;

  constructor(data: GameParticipation) {
    const { id, idGame, idPlayer, nbMove, createdAt } = data;
    this.id = id;
    this.idGame = idGame;
    this.idPlayer = idPlayer;
    this.nbMove = nbMove;
    this.createdAt = createdAt;
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
}
