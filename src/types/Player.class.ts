import { getTimestamp } from "@/lib/utils";

/**
 * Classe représentant un joueur
 */
export class Player {
  /**
   * Identifiant du joueur
   */
  public id?: number;

  /**
   * Pseudo du joueur
   */
  public pseudo?: string;

  /**
   * Nombre de cartes posées par le joueur toute partie confondue
   */
  public nbMove: number = 0;

  /**
   * Nombre de victoires du joueur
   */
  public nbVictory: number = 0;

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt?: number = getTimestamp();

  constructor(init: Partial<Player>) {
    Object.assign(this, init);
  }

  /**
   * Ajoute une victoire au joueur
   */
  public addVictory() {
    this.nbVictory++;
  }
}
