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
   * Nombre de manches pour gagner la partie
   */
  public nbRound: number;

  /**
   * Nombre de joueurs dans la partie
   */
  public nbPlayer: number;

  /**
   * Temps qu'a duré la partie
   */
  public duration: number;

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt: Date;

  constructor(data: Game) {
    const { id, duration, winner, nbMove, nbRound, nbPlayer, createdAt } = data;
    this.id = id;
    this.winner = new Player(winner);
    this.nbMove = nbMove;
    this.nbRound = nbRound;
    this.nbPlayer = nbPlayer;
    this.duration = duration;
    this.createdAt = new Date(createdAt);
  }
}
