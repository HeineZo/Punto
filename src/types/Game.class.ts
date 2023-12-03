import { getTimestamp } from "@/lib/utils";
import { GameParticipation } from "./GameParticipation.class";
import { GameRound } from "./GameRound.class";
import { Player } from "./Player.class";
import { Range } from "./type";

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
  public winner?: Player | null;

  /**
   * Nombre de cartes posées par tous les joueurs dans la partie
   */
  public nbMove: number = 0;

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
   * Base de donnée utilisée pour la partie
   */
  public database?: "mysql" | "sqlite" | "mongodb";

  /**
   * Date à laquelle la partie a été jouée
   */
  public createdAt?: number;

  /**
   * Construis une nouvelle partie
   * @param init Données de la nouvelle partie
   */
  public constructor(init: Partial<Game>) {
    Object.assign(this, init);
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
   * Démarre une nouvelle manche
   */
  public async start() {
    // Si le nombre de manches est atteint, on ne peut pas commencer une nouvelle manche
    if (this.rounds.length >= this.nbRound) {
      return;
    }
    // On récupère les participants de la première manche s'il y en a une
    let participations = this.rounds[0]?.players;
    // Sinon on récupère les participants de la partie
    if (!participations || participations.length <= 0) {
      participations = await GameParticipation.findFromGame(this.id ?? -1);
    }
    // On ajoute la nouvelle manche
    this.rounds.push(new GameRound({ players: participations }));
    this.createdAt = getTimestamp();
  }

  /**
   * Place une carte dans la partie
   */
  public placeCard(rowPosition: Range<1, 7>, colPosition: Range<1, 7>) {
    this.rounds[this.getCurrentRound()].placeCard(rowPosition, colPosition);
    this.nbMove++;
  }

  /**
   * Détermine la manche en cours
   * @returns La manche actuelle
   */
  public getCurrentRound() {
    return this.rounds.length - 1;
  }

  /**
   * Détermine si la manche en cours est terminée
   */
  public endRound() {
    this.rounds[this.getCurrentRound()].endRound();
    const roundWinner = this.rounds[this.getCurrentRound()].winner;
    const winner = this.players.find((player) => player.id === roundWinner?.id);
    if (winner) {
      winner.nbVictory++;
    }

    if (this.rounds.length === this.nbRound) {
      this.endGame();
    }
  }

  /**
   * Fini la partie
   */
  public async endGame() {
    this.duration = getTimestamp() - this.createdAt;
    this.winner = this.determineGameWinner();
    return await this.update();
  }

  /**
   * Retourne le joueur qui doit jouer
   * @returns Le joueur qui doit jouer
   */
  public getCurrentPlayer() {
    return this.rounds[this.getCurrentRound()]?.moves?.at(-1)?.participation;
  }

  /**
   * Retourne le dernier coup qui a été joué
   * @returns La dernière coup qui a été joué
   */
  public getLastmove() {
    return this.rounds[this.getCurrentRound()]?.moves?.at(-1);
  }

  /**
   * Détermine qui a gagné la partie
   * @returns Le joueur qui a gagné la partie
   */
  public determineGameWinner() {
    // Retourner le joueur avec le plus de victoires
    return this.players.reduce((prevPlayer, nextPlayer) => {
      if (prevPlayer.nbVictory < nextPlayer.nbVictory) {
        return nextPlayer;
      }
      return prevPlayer;
    });
  }

  /**
   * Sauvegarde la partie dans la base de donnée
   * @returns True si la partie a été sauvegardée, false sinon
   */
  public async save(): Promise<boolean> {
    try {
      const res = await fetch("http://localhost:3002/game", {
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
   * Met à jour la base la partie dans la base de donnée
   * @returns True si la partie a été sauvegardée, false sinon
   */
  public async update(): Promise<boolean> {
    try {
      const res = await fetch("http://localhost:3002/game", {
        method: "PUT",
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
   * Génère des parties aléatoires
   * @param nbGame Nombre de parties à générer
   * @param nbPlayer Nombre de joueurs dans chaque partie
   * @returns Réponse de l'API
   */
  public static async generate(
    nbGame: number,
    nbPlayer: number,
    database: "mysql" | "sqlite" | "mongodb"
  ): Promise<[boolean, { message: string }]> {
    const res = await fetch("http://localhost:3002/game/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nbGame,
        nbPlayer,
        database
      }),
    });
    return [res.ok, await res.json()];
  }
}
