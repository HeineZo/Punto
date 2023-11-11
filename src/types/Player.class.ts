/**
 * Classe représentant un joueur
 */
export class Player {
  /**
   * Identifiant du joueur
   */
  public id: number;

  /**
   * Pseudo du joueur
   */
  public pseudo: string;

  /**
   * Mot de passe du joueur
   */
  public password: string;

  /**
   * Nombre de cartes posées par le joueur toute partie confondue
   */
  public nbMove: number;

  /**
   * Nombre de victoires du joueur
   */
  public nbVictory: number;

  /**
   * Nombre de défaites du joueur
   */
  public nbDefeat: number;

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt: number;

  constructor(data: Player) {
    const { id, pseudo, password, nbMove, nbVictory, nbDefeat, createdAt } = data;
    this.id = id;
    this.pseudo = pseudo;
    this.nbMove = nbMove;
    this.password = password;
    this.nbVictory = nbVictory;
    this.nbDefeat = nbDefeat;
    this.createdAt = createdAt;
  }
}
