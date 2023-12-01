import { getTimestamp } from "@/utils/utils";
import { Colors, Range } from "./type";

/**
 * Carte du jeu
 */
export class Card {
  /**
   * Couleur de la carte
   */
  public color?: Colors;

  /**
   * Valeur de la carte
   */
  public value?: Range<1, 9>;

  /**
   * Position horizontale de la carte sur le plateau
   */
  public rowPosition?: Range<1, 7>;

  /**
   * Position verticale de la carte sur le plateau
   */
  public colPosition?: Range<1, 7>;

  /**
   * Date à laquelle la carte a été jouée
   */
  public createdAt?: number = getTimestamp();

  constructor(init: Partial<Card>) {
    Object.assign(this, init);
  }

  /**
   * Détermine si la carte a été posée
   * @returns true si la carte est une carte valide
   */
  public isCard() {
    return this.rowPosition && this.colPosition;
  }

  /**
   * Récupérer les cartes adjacentes à une carte
   * @param row
   * @param col
   * @param grid
   * @returns
   */
  public static getAdjacentCards(row: number, col: number, grid: unknown[][]) {
    // Coordonnées des cases adjacentes : haut, bas, gauche, droite et diagonales
    const directions = [
      { row: row - 1, col }, // Haut
      { row: row + 1, col }, // Bas
      { row, col: col - 1 }, // Gauche
      { row, col: col + 1 }, // Droite
      { row: row - 1, col: col - 1 }, // Diagonale haut gauche
      { row: row - 1, col: col + 1 }, // Diagonale haut droite
      { row: row + 1, col: col - 1 }, // Diagonale bas gauche
      { row: row + 1, col: col + 1 }, // Diagonale bas droite
    ];

    for (const { row, col } of directions) {
      // Vérifier les limites de la grille
      if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
        const adjacentCard = grid[row][col] as Card;
        if (adjacentCard?.isCard()) {
          return true;
        }
      }
    }

    return false;
  }
}
