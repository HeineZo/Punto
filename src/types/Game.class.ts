import { Player } from "./Player.class";

/**
 * Classe représentant une partie
 */
export class Game {
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
   * Temps qu'a duré la partie
   */
  public duration: number;

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt: number;

  constructor(data: Game) {
    const { id, duration, winner, nbMove, createdAt } = data;
    this.id = id;
    this.winner = new Player(winner);
    this.nbMove = nbMove;
    this.duration = duration;
    this.createdAt = createdAt;
  }
}
