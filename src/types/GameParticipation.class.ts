import { Game } from "./Game.class";
import { Player } from "./Player.class";

/**
 * Classe représentant une participation d'un joueur dans une partie
 */
export class GameParticipation {
  /**
   * Identifiant de la participation d'un joueur dans une partie
   */
  public id: number;

  /**
   * Partie à laquelle le joueur participe
   */
  public game: Game;

  /**
   * Joueur qui participe à la partie
   */
  public player: Player;

  /**
   * Nombre de cartes posées par le joueur dans la partie
   */
  public nbMove: number;

  /**
   * Date à laquelle le joueur a participé à la partie
   */
  public createdAt: number;

  constructor(data: GameParticipation) {
    const { id, game, player, nbMove, createdAt } = data;
    this.id = id;
    this.game = new Game(game);
    this.player = new Player(player);
    this.nbMove = nbMove;
    this.createdAt = createdAt;
  }
}
