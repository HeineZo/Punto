import { getTimestamp } from "@/utils/utils";
import { Card } from "./Card.class";
import { GameParticipation } from "./GameParticipation.class";

/**
 * Carte posée par un joueur dans une partie
 */
export class GameMove extends Card {
  /**
   * Identifiant de la carte qui a été jouée
   */
  public id?: number;

  /**
   * Joueur qui a joué la carte
   */
  public participation?: GameParticipation;

  /**
   * Date à laquelle la carte a été jouée
   */
  public createdAt?: number = getTimestamp();

  constructor(init: Partial<GameMove>) {
    super(init);
    Object.assign(this, init);
  }
}
