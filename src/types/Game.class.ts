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
  public nbRound?: number;

  /**
   * Joueurs qui participent à la partie
   */
  public players: Player[] = [];

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
  public createdAt: Date = new Date();

  /**
   * Construis une nouvelle partie
   * @param init Données de la nouvelle partie
   */
  public constructor(init?: Partial<Game>) {
    Object.assign(this, init);
  }

  /**
   * Sauvegarde la partie dans la base de donnée
   */
  public async save() {
    try {
      const res = await fetch("http://localhost:3002/game/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this),
      });

      return await res.json();
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Erreur",
      //   description: "Une erreur est survenue",
      //   action: <XCircle />,
      // });
      console.error(error);
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
   * Créer une partie
   */
  // public async create(data) {
  //   try {
  //     const res = await fetch("http://localhost:3002/game/new", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         nbGame: formData.nbGame,
  //         nbPlayer: formData.nbPlayer,
  //       }),
  //     });

  //     const data = await res.json();
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Erreur",
  //       description: "Une erreur est survenue",
  //       action: <XCircle />,
  //     });
  //     console.error(error);
  //   }
  // }
}
