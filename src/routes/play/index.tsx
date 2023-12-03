import { gameGrid, gameInProgress } from "@/lib/store";
import { useAtom } from "jotai";
import CreateGame from "./CreateGame.component";

import { Game } from "@/types/Game.class";
import { checkWin } from "@/lib/utils";
import { useEffect } from "react";
import GameHeader from "./GameHeader.component";
import GameCard from "./components/GameCard.component";
import { GameDialog } from "./components/GameDialog.component";
import Grid from "./components/Grid.component";

export default function PlayGame() {
  const [game, setGame] = useAtom(gameInProgress);
  const [grid, setGrid] = useAtom(gameGrid);

  // Détecter s'il y a un gagnant
  useEffect(() => {
    if (!game?.nbPlayer) {
      return;
    }

    const nbCardToWin = game.nbPlayer === 2 ? 4 : 5;
    if (checkWin(grid, nbCardToWin)) {
      game.endRound();
      setGame(new Game(game));
    }
  }, [grid]);

  // Si la partie n'est pas initialisée, on affiche le formulaire de création
  if (!game?.id) {
    return (
      <main className="flex w-full justify-center items-center">
        <CreateGame />
      </main>
    );
  }

  return (
    <main className="container">
      <GameHeader />
      <div className="flex flex-col items-center justify-center gap-16 h-screen">
        <Grid />
        <GameCard card={game?.getCurrentPlayer()?.getCardToPlay() ?? null} />
      </div>
      <GameDialog />
    </main>
  );
}
