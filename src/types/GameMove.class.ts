import { Game } from "./Game.class";
import { Player } from "./Player.class";
import { Colors, Range } from "./type";

/**
 * Carte posée par un joueur dans une partie
 */
export class GameMove {
  /**
   * Identifiant de la carte qui a été jouée
   */
  public id?: number;

  public player?: Player;

  public game?: Game;

  /**
   * Participation du joueur qui a joué la carte dans une partie
   */
  // public participation: GameParticipation;

  /**
   * Couleur de la carte
   */
  public color?: Colors;

  /**
   * Valeur de la carte
   */
  public value?: Range<1, 9>;

  /**
   * Position horizontale de la carte sur le plateau
   */
  public rowPosition?: Range<1, 6>;

  /**
   * Position verticale de la carte sur le plateau
   */
  public colPosition?: Range<1, 6>;

  /**
   * Date à laquelle la carte a été jouée
   */
  public createdAt: Date = new Date();

  constructor(init: Partial<GameMove>) {
    Object.assign(this, init);
  }
}
