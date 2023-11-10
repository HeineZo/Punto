/**
 * Génère un nombre aléatoire entre 2 valeurs
 * @param min Nombre minimum (inclus)
 * @param max Nombre maximum (inclus)
 * @returns Nombre aléatoire
 */
export function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  