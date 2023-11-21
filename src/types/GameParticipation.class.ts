import { getTimestamp } from "@/utils/utils";
import { Game } from "./Game.class";
import { Player } from "./Player.class";
import { Colors } from "./type";

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
  public game?: Game;

  /**
   * Joueur qui participe à la partie
   */
  public player?: Player;

  /**
   * Nombre de cartes posées par le joueur dans la partie
   */
  public nbMove: number = 0;

  /**
   * Couleurs des cartes posées par le joueur dans la partie
   */
  public colors?: Colors[];

  public cards?: 

  /**
   * Date à laquelle le joueur a participé à la partie
   */
  public createdAt?: number = getTimestamp();

  constructor(init: Partial<GameParticipation>) {
    Object.assign(this, init);
  }
}
