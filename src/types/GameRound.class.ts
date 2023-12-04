import { enumToArray, findLast, getTimestamp } from "@/lib/utils";
import { Card } from "./Card.class";
import { GameMove } from "./GameMove.class";
import { GameParticipation } from "./GameParticipation.class";
import { Player } from "./Player.class";
import { Colors, Range } from "./type";

/**
 * Classe représentant une manche dans une partie
 */
export class GameRound {
  /**
   * Gagnant de la manche
   */
  public winner?: Player;

  /**
   * Nombre de cartes posées par tous les joueurs dans la manche
   */
  public nbMove: number = 0;

  /**
   * Joueurs qui participent à la manche
   */
  public players: GameParticipation[] = [];

  /**
   * Cartes posées par les joueurs durant la manche
   */
  public moves: GameMove[] = [];

  /**
   * Temps qu'a duré le tour
   */
  public duration: number = 0;

  /**
   * Date à laquelle la manché a été commencée
   */
  public createdAt: number = getTimestamp();

  /**
   * Construis une nouvelle manche
   * @param init Données de la nouvelle manche
   */
  public constructor(init?: Partial<GameRound>) {
    Object.assign(this, init);
    this.distributeCards();
    this.moves.push(new GameMove({ participation: this.chooseRandomPlayer() }));
  }

  /**
   * Retourne le dernier coup qui a été joué
   * @returns La dernière coup qui a été joué
   */
  public getLastmove() {
    return this.moves[this.moves.length - 1];
  }

  /**
   * Termine la manche
   */
  public endRound() {
    this.duration = getTimestamp() - this.createdAt;
    this.winner = findLast(
      this.moves,
      (move) =>
        move?.rowPosition !== undefined && move?.colPosition !== undefined
    )?.participation?.player;
    this.players.forEach((player) => (player.cards = []));
  }

  /**
   * Choisi un joueur aléatoire dans la partie
   * @returns Un joueur aléatoire parmi les joueurs de la partie
   */
  public chooseRandomPlayer() {
    const randomIndex = Math.floor(Math.random() * this.players.length);
    return this.players[randomIndex];
  }

  /**
   * Place une carte sur le plateau
   */
  public placeCard(rowPosition: Range<1, 7>, colPosition: Range<1, 7>) {
    const lastMove = this.moves.at(-1);

    if (!lastMove || lastMove?.colPosition || lastMove?.rowPosition) {
      return;
    }

    // Place la carte sur le plateau
    lastMove?.placeCard(rowPosition, colPosition);
    this.moves[this.moves.length - 1] = lastMove;

    // Incrémente le nombre de cartes jouées pendant la manche
    this.nbMove++;
    // Passe au joueur suivant
    this.nextPlayer();
  }

  /**
   * Passe au joueur suivant
   */
  public nextPlayer() {
    const lastMove = this.moves?.at(-1);
    const lastPlayer = lastMove?.participation;
    const currentIndex = this.players.findIndex(
      (player) => player.id === lastPlayer?.id
    );
    const nextIndex = (currentIndex + 1) % this.players.length;
    const nextPlayer = this.players[nextIndex];
    this.moves?.push(new GameMove({ participation: nextPlayer }));
  }

  /**
   * Distribue les cartes aux joueurs
   */
  public distributeCards() {
    const colors = enumToArray(Colors);

    for (const player of this.players) {
      if (this.players.length > 2) {
        player.cards.push(...this.generateDeck(colors));
      } else {
        for (let i = 0; i < 2; i++) {
          player.cards.push(...this.generateDeck(colors));
        }
      }

      // Mélanger les cartes
      player.shuffle();
    }
  }

  /**
   * Génère un paquet de carte d'une couleur aléatoire parmis la liste des couleurs données
   * @param colors Liste des couleurs
   * @returns Paquet de cartes
   */
  public generateDeck(colors: Colors[]): Card[] {
    const cards = [];
    const randomColor = Math.floor(Math.random() * colors.length);

    for (let i = 1; i <= 9; i++) {
      const card = new Card({
        color: colors[randomColor],
        value: i as Range<1, 9>,
      });

      cards.push(card);
    }

    colors.splice(randomColor, 1);
    return cards;
  }
}
