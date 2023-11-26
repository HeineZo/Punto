import { getTimestamp } from "@/utils/utils";
import { Colors, Range } from "./type";

/**
 * Carte du jeu
 */
export class Card {
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
  public createdAt?: number = getTimestamp();

  constructor(init: Partial<Card>) {
    Object.assign(this, init);
  }
}
