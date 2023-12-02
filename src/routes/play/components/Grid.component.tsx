import { Range } from "@/types/type";
import GridCase from "./GridCase";

/**
 * Grille de jeu
 */
export default function Grid() {
  const gridSize = 7; // Taille de la grille
  const gridCase = [];

  // Générer les cases pour chaque ligne et chaque colonne
  for (let row = 1; row <= gridSize; row++) {
    for (let col = 1; col <= gridSize; col++) {
      gridCase.push(
        <GridCase
          key={`${row}-${col}`}
          rowPosition={row as Range<1, 7>}
          colPosition={col as Range<1, 7>}
        />
      );
    }
  }

  return <div className="grid grid-cols-7 grid-rows-7 gap-2">{gridCase}</div>;
}
