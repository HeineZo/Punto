// import plural from "pluralize-fr";

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
