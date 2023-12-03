import { getTimestamp } from "@/lib/utils";
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
    let currentIndex = this.cards.length;
    let temporaryValue;
    let randomIndex;

    // Tant qu'il y a encore une carte à mélanger
    while (currentIndex) {
      // On prend une carte au hasard
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // On remplace la carte choisi aléatoirement par la carte courante
      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
  }

  /**
   * Récupère la carte à jouer
   * @returns La carte à jouer
   */
  public getCardToPlay() {
    return this.cards?.at(-1);
  }

  /**
   * Place une carte sur le plateau
   */
  public placeCard() {
    this.cards.pop();
    this.nbMove++;
  }

  /**
   * Récupère les participations d'une partie
   * @param idGame Identifiant de la partie
   * @returns Participations trouvées
   */
  public static async findFromGame(idGame: number) {
    try {
      const res = await fetch(
        "http://localhost:3002/participation/game/" + idGame
      );
      const result = await res.json();
      return result.map(
        (participation: GameParticipation) =>
          new GameParticipation(participation)
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
