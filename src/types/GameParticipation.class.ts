import { getTimestamp } from "@/utils/utils";
import { Card } from "./Card.class";
import { Player } from "./Player.class";

/**
 * Classe représentant une participation d'un joueur dans une partie
 */
export class GameParticipation {
  /**
   * Identifiant de la participation d'un joueur dans une partie
   */
  public id?: number;

  /**
   * Partie à laquelle le joueur participe
   */
  // public game?: Game;

  /**
   * Joueur qui participe à la partie
   */
  public player?: Player;

  /**
   * Nombre de cartes posées par le joueur dans la partie
   */
  public nbMove: number = 0;

  /**
   * Paquet de carte du joueur
   */
  public cards: Card[] = [];

  /**
   * Date à laquelle le joueur a participé à la partie
   */
  public createdAt: number = getTimestamp();

  constructor(init: Partial<GameParticipation>) {
    Object.assign(this, init);
  }

  /**
   * Cherche les couleurs du joueur à partir de son paquet de carte
   * @returns Les couleurs des cartes du joueur
   */
  public getColors() {
    return Array.from(new Set(this.cards.map((card) => card.color)));
  }

  /**
   * Mélange les cartes du joueur
   */
  public shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  /**
   * Récupère la carte à jouer
   * @returns La carte à jouer
   */
  public getCardToPlay() {
    return this.cards?.at(-1);
  }
}
