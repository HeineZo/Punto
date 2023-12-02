import { gameGrid, gameInProgress } from "@/utils/store";
import { useAtom } from "jotai";
import CreateGame from "./CreateGame.component";

import { Card } from "@/types/Card.class";
import { Game } from "@/types/Game.class";
import { checkWin } from "@/utils/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameHeader from "./GameHeader.component";
import GameCard from "./components/GameCard.component";
import { GameDialog } from "./components/GameDialog.component";
import Grid from "./components/Grid.component";
import { useToast } from "@/components/ui/use-toast";
import { XCircle } from "lucide-react";
import { Player } from "@/types/Player.class";

export default function PlayGame() {
  const [game, setGame] = useAtom(gameInProgress);
  const [grid, setGrid] = useAtom(gameGrid);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Détecter s'il y a un gagnant
  useEffect(() => {
    if (!game?.nbPlayer) {
      return;
    }

    const nbCardToWin = game.nbPlayer === 2 ? 4 : 5;
    if (checkWin(grid, nbCardToWin)) {
      game.endRound();
      update();
    }
  }, [grid]);

  /**
   * Met à jour le jeu
   */
  const update = () => {
    setGame(new Game(game));
  };

  /**
   * Termine la partie
   */
  function handleEndGame() {
    // On réinitialise la grille
    setGrid(
      Array.from({ length: 7 }, () =>
        Array.from({ length: 7 }).fill(new Card({}))
      )
    );
    game?.endGame();
    setGame(new Game());
  }

  /**
   * Passe à la manche suivante
   */
  async function handleNextRound() {
    // On réinitialise la grille
    setGrid(
      Array.from({ length: 7 }, () =>
        Array.from({ length: 7 }).fill(new Card({}))
      )
    );
    await game?.start();
    update();
  }

  /**
   * Relance une partie
   */
  async function handleReplay() {
    // On réinitialise la grille
    setGrid(
      Array.from({ length: 7 }, () =>
        Array.from({ length: 7 }).fill(new Card({}))
      )
    );
    game?.endGame();
    const newGame = new Game({ nbPlayer: game.players.length, nbRound: game.nbRound });
    for (const player of game.players) {
      newGame.addPlayer(new Player({ pseudo: player.pseudo }));
    }
    const success = await newGame.save();
    if (!success) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la partie",
        action: <XCircle />,
      });
    }
    await newGame.start();
    setGame(newGame);
  }

  /**
   * Détermine quel popup à afficher en fonction de l'état de la partie
   * @returns Le popup à afficher
   */
  function displayPopup() {
    if (game?.winner) {
      return (
        <GameDialog
          open={game?.winner !== undefined}
          title="Partie terminée"
          description={`${game?.winner?.pseudo} remporte la partie avec ${game?.winner?.nbVictory} manches remportées`}
          cancelBtn={{
            text: "Revenir à l'écran d'accueil",
            onClick: () => {
              handleEndGame();
              navigate("/");
            },
          }}
          confirmBtn={{
            text: "Rejouer",
            onClick: handleReplay,
          }}
        />
      );
    }

    const { winner } = game.rounds[game.getCurrentRound()];

    return (
      <GameDialog
        open={winner !== undefined}
        title={`${winner?.pseudo} remporte la manche 🥳`}
        cancelBtn={{
          text: "Déclarer forfait",
          onClick: handleEndGame,
        }}
        confirmBtn={{
          text: "Manche suivante",
          onClick: handleNextRound,
        }}
      />
    );
  }

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
      {displayPopup()}
    </main>
  );
}
