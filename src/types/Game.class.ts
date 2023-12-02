import { getTimestamp } from "@/utils/utils";
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
   * Date à laquelle la partie a été jouée
   */
  public createdAt: number = getTimestamp();

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

    if (this.rounds.length === this.nbRound) {
      this.endGame();
    }
  }

  /**
   * Fini la partie
   */
  public endGame() {
    this.duration = getTimestamp() - this.createdAt;
    this.winner = this.determineGameWinner();
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
    const playerWins: { player: Player; wins: number }[] = [];

    // Parcourir chaque manche
    this.rounds.forEach((round: GameRound) => {
      const winner = round.winner;
      if (winner) {
        // Vérifier si le joueur a déjà gagné une manche
        const index = playerWins.findIndex(
          (item) => item.player.id === winner.id
        );
        // S'il existe déjà dans la liste on incrémente son nombre de victoires, sinon on en crée un nouveau
        if (index !== -1) {
          playerWins[index].wins++;
        } else {
          playerWins.push({ player: winner, wins: 1 });
        }
      }
    });

    // Trier les joueurs par nombre de victoires
    const sortedPlayers = playerWins.slice().sort((a, b) => b.wins - a.wins);
    // Récupérer le nombre de victoires du joueur avec le plus de victoires
    const mostWins = sortedPlayers[0].wins;
    // Récupérer les joueurs avec le plus de victoires
    const playersWithMostWins = sortedPlayers.filter(
      (player) => player.wins === mostWins
    );

    // Retourner le joueur avec le plus de victoires
    return playersWithMostWins.length === 1
      ? playersWithMostWins[0].player
      : null;
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
