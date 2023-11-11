import { GameParticipation } from "./GameParticipation.class";
import { Colors, Range } from "./type";

/**
 * Carte posée par un joueur dans une partie
 */
export class GameMove {
  /**
   * Identifiant de la carte qui a été jouée
   */
  public id: number;

  /**
   * Participation du joueur qui a joué la carte dans une partie
   */
  public participation: GameParticipation;

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
  public rowPosition: Range<1, 6>;

  /**
   * Position verticale de la carte sur le plateau
   */
  public colPosition: Range<1, 6>;

  /**
   * Date à laquelle la carte a été jouée
   */
  public createdAt: number;

  constructor(data: GameMove) {
    const {
      id,
      participation,
      color,
      value,
      rowPosition,
      colPosition,
      createdAt,
    } = data;
    this.id = id;
    this.participation = new GameParticipation(participation);
    this.color = color;
    this.value = value;
    this.rowPosition = rowPosition;
    this.colPosition = colPosition;
    this.createdAt = createdAt;
  }
}
