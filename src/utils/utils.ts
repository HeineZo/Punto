// import plural from "pluralize-fr";

import { Card } from "@/types/Card.class";

// function pluralize(count, word) {
//     return plural(word, count);
// }

/**
 * Récupère le timestamp unix en seconde actuel
 * @returns Timestamp actuel
 */
export function getTimestamp() {
  return Math.round(+new Date() / 1000);
}

interface EnumToArray<T> {
  [key: string]: T;
}

/**
 * Convertis une énumération en tableau
 * @param enume Enumération à convertir
 * @returns Tableau des valeurs de l'énumération
 */
export function enumToArray<T>(enume: EnumToArray<T>): T[] {
  return Object.keys(enume).map((key) => enume[key]);
}

/**
 * Vérifie horizontalement si une séquence de cartes est gagnante
 * @param grid Grille de jeu contenant les cartes
 * @param sequenceLength Nombre de cartes à aligner pour gagner
 * @returns True si une séquence de cartes est gagnante
 */
function checkHorizontal(grid: unknown[][], sequenceLength: number) {
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col <= 7 - sequenceLength; col++) {
      const rowSequence = grid[row].slice(col, col + sequenceLength) as Card[];
      if (checkSequence(rowSequence)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Vérifie verticalement si une séquence de cartes est gagnante
 * @param grid Grille de jeu contenant les cartes
 * @param sequenceLength Nombre de cartes à aligner pour gagner
 * @returns True si une séquence de cartes est gagnante
 */
function checkVertical(grid: unknown[][], sequenceLength: number) {
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= 7 - sequenceLength; row++) {
      const sequence = [];
      for (let i = 0; i < sequenceLength; i++) {
        sequence.push(grid[row + i][col] as Card);
      }
      if (checkSequence(sequence)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Vérifie en diagonale de gauche à droite si une séquence de cartes est gagnante
 * @param grid Grille de jeu contenant les cartes
 * @param sequenceLength Nombre de cartes à aligner pour gagner
 * @returns True si une séquence de cartes est gagnante
 */
function checkDiagonalLeftToRight(grid: unknown[][], sequenceLength: number) {
  for (let row = 0; row <= 7 - sequenceLength; row++) {
    for (let col = 0; col <= 7 - sequenceLength; col++) {
      const sequence = [];
      for (let i = 0; i < sequenceLength; i++) {
        sequence.push(grid[row + i][col + i] as Card);
      }
      if (checkSequence(sequence)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Vérifie en diagonale de droite à gauche si une séquence de cartes est gagnante
 * @param grid Grille de jeu contenant les cartes
 * @param sequenceLength Nombre de cartes à aligner pour gagner
 * @returns True si une séquence de cartes est gagnante
 */
function checkDiagonalRightToLeft(grid: unknown[][], sequenceLength: number) {
  for (let row = 0; row <= 7 - sequenceLength; row++) {
    for (let col = sequenceLength - 1; col < 7; col++) {
      const sequence = [];
      for (let i = 0; i < sequenceLength; i++) {
        sequence.push(grid[row + i][col - i] as Card);
      }
      if (checkSequence(sequence)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Vérifie si une séquence de cartes est gagnante
 * @param cards Cartes à vérifier
 * @returns True si une séquence de cartes est gagnante
 */
function checkSequence(cards: Card[]) {
  const firstColor = cards[0].color;
  if (!firstColor) {
    return false;
  }
  return cards.every((card) => card.color === firstColor);
}

/**
 * Vérifie si une séquence de cartes est gagnante 
 * @param grid Grille de jeu contenant les cartes
 * @param sequenceLength Nombre de cartes à aligner pour gagner
 * @returns True si une séquence de cartes est gagnante 
 */
export function checkWin(grid: unknown[][], sequenceLength: number) {
  return (
    checkHorizontal(grid, sequenceLength) ||
    checkVertical(grid, sequenceLength) ||
    checkDiagonalLeftToRight(grid, sequenceLength) ||
    checkDiagonalRightToLeft(grid, sequenceLength)
  );
}
