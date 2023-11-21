import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useAtom } from "jotai";
import { gameInProgress } from "@/utils/store";

/**
 * En-tête de la page de jeu
 */
export default function GameHeader() {
  const [game, setGame] = useAtom(gameInProgress);

  return (
    <div className="flex justify-between">
      <Button asChild variant="secondary">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Revenir au salon
        </Link>
      </Button>
      <div>
        <h3>Au tour de {game?.moves?.at(-1)?.player?.pseudo}</h3>
      </div>
      <div>
        <Button variant="outline" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
