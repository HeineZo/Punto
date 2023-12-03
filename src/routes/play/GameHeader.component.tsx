import { Button } from "@/components/ui/button";
import { gameInProgress } from "@/lib/store";
import { useAtom } from "jotai";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * En-tête de la page de jeu
 */
export default function GameHeader() {
  const [game, setGame] = useAtom(gameInProgress);

  /**
   * Affiche les couleurs des cartes du joueur courant
   */
  function displayCardColors() {
    // Couleurs possible des cartes
    const colorVariants = {
      blue: "bg-blue-500 border-blue-200",
      red: "bg-red-500 border-red-200",
      green: "bg-green-500 border-green-200",
      yellow: "bg-yellow-500 border-yellow-200",
    };
    // Couleurs du joueur courant
    const colors = game?.getCurrentPlayer()?.getColors() ?? [];
    const colorSquares = [];
    // Pour chaque couleur, on affiche un carré de la couleur
    for (const color of colors) {
      colorSquares.push(
        <span
          key={color}
          className={`${
            colorVariants[color ?? "blue"]
          } h-5 w-5 rounded border-2`}
        />
      );
    }

    return colorSquares;
  }

  return (
    <div className="flex justify-between items-center">
      <Button asChild variant="secondary">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Revenir au salon
        </Link>
      </Button>
      <div className="flex gap-4 items-center">
        <h3>Au tour de {game?.getCurrentPlayer()?.player?.pseudo}</h3>
        <div className="flex gap-2 items-center mt-1">{displayCardColors()}</div>
      </div>
      <div>
        Manche <strong>{game?.getCurrentRound()+1}</strong> sur{" "}
        <strong>{game?.nbRound}</strong>
      </div>
    </div>
  );
}
