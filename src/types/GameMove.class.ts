import { getTimestamp } from "@/utils/utils";
import { Card } from "./Card.class";
import { GameParticipation } from "./GameParticipation.class";
import { Range } from "./type";

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
    super({ ...init, ...init.participation?.getCardToPlay() });
    Object.assign(this, init);
  }

  /**
   * Place une carte sur le plateau
   */
  public placeCard(rowPosition: Range<1, 7>, colPosition: Range<1, 7>) {
    this.rowPosition = rowPosition;
    this.colPosition = colPosition;
    this.participation?.placeCard();
    this.save();
  }

  /**
   * Sauvegarde la partie dans la base de donnée
   * @returns True si la partie a été sauvegardée, false sinon
   */
  public async save(): Promise<boolean> {
    try {
      const res = await fetch("http://localhost:3002/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this),
      });

      Object.assign(this, await res.json());
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
