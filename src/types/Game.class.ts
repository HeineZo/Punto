import { getTimestamp } from "@/utils/utils";
import { GameParticipation } from "./GameParticipation.class";
import { GameRound } from "./GameRound.class";
import { Player } from "./Player.class";

/**
 * Classe représentant une partie
 */
export class Game {
  /**
   * Nombre de joueurs minimum dans une partie
   */
  public static minNbPlayer = 2;

  /**
   * Nombre de joueurs maximum dans une partie
   */
  public static maxNbPlayer = 4;

  /**
   * Nombre de manches minimum pour gagner la partie
   */
  public static minNbRound = 2;

  /**
   * Nombre de manches maximum pour gagner la partie
   */
  public static maxNbRound = 10;

  /**
   * Identifiant de la partie
   */
  public id?: number;

  /**
   * Gagnant de la partie
   */
  public winner?: Player;

  /**
   * Nombre de cartes posées par tous les joueurs dans la partie
   */
  public nbMove?: number;

  /**
   * Nombre de manches pour gagner la partie
   */
  public nbRound: number = 0;

  /**
   * Joueurs qui participent à la partie
   */
  public players: Player[] = [];

  /**
   * Manches de la partie
   */
  public rounds: GameRound[] = [];

  /**
   * Nombre de joueurs dans la partie
   */
  public nbPlayer?: number;

  /**
   * Temps qu'a duré la partie
   */
  public duration?: number;

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt?: number = getTimestamp();

  /**
   * Construis une nouvelle partie
   * @param init Données de la nouvelle partie
   */
  public constructor(init?: Partial<Game>) {
    Object.assign(this, init);
  }

  /**
   * Sauvegarde la partie dans la base de donnée
   * @returns True si la partie a été sauvegardée, false sinon
   */
  public async save(): Promise<boolean> {
    try {
      const res = await fetch("http://localhost:3002/game/new", {
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

  /**
   * Ajoute un joueur à la partie
   * @param player Joueur à ajouter
   */
  public addPlayer(player: Player) {
    this.nbPlayer = this.players.length + 1;
    this.players = [...this.players, player];
  }

  /**
   * Démarre la partie
   */
  public start() {
    const participations = [];
    for (const player of this.players) {
      participations.push(new GameParticipation({ player }));
    }
    this.rounds.push(new GameRound({ players: participations }));
  }

  /**
   * Détermine la manche en cours
   * @returns La manche actuelle
   */
  public getCurrentRound() {
    return this.rounds.length - 1;
  }

  /**
   * Détermine le joueur qui doit jouer
   * @returns Le joueur qui doit jouer
   */
  public getCurrentPlayer() {
    return this.rounds[this.getCurrentRound()]?.moves?.at(-1)?.participation;
  }

  /**
   * Génère des parties aléatoires
   * @param nbGame Nombre de parties à générer
   * @param nbPlayer Nombre de joueurs dans chaque partie
   * @returns Réponse de l'API
   */
  public static async generate(
    nbGame: number,
    nbPlayer: number
  ): Promise<[boolean, { message: string }]> {
    const res = await fetch("http://localhost:3002/game/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nbGame,
        nbPlayer,
      }),
    });
    return [res.ok, await res.json()];
  }
}
