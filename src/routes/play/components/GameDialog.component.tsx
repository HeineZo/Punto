import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/types/Card.class";
import { Game } from "@/types/Game.class";
import { Player } from "@/types/Player.class";
import { gameGrid, gameInProgress } from "@/lib/store";
import { useAtom } from "jotai";
import { XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Dialog = {
  title: string;
  description?: string;
  cancelBtn: {
    text: string;
    onClick: () => void;
  };
  confirmBtn: {
    text: string;
    onClick: () => void;
  };
};

/**
 * Affiche une popup pendant la partie
 * @param open Détermine si le popup doit être affiché
 * @param title Titre du popup
 * @param description? Description du popup
 * @param cancelBtn Bouton d'annulation
 * @param confirmBtn Bouton de confirmation
 */
export function GameDialog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [game, setGame] = useAtom(gameInProgress);
  const [grid, setGrid] = useAtom(gameGrid);
  const [dialog, setDialog] = useState<Dialog>();

  useEffect(() => {
    const { winner } = game.rounds[game.getCurrentRound()];
    if (game?.winner) {
      setDialog({
        title: "Partie terminée",
        description: `${game?.winner?.pseudo} remporte la partie avec ${game?.winner?.nbVictory} manches remportées`,
        cancelBtn: {
          text: "Revenir à l'écran d'accueil",
          onClick: () => {
            handleEndGame();
            navigate("/");
          },
        },
        confirmBtn: {
          text: "Rejouer",
          onClick: handleReplay,
        },
      });
    } else if (winner) {
      setDialog({
        title: `${winner?.pseudo} remporte la manche 🥳`,
        cancelBtn: {
          text: "Déclarer forfait",
          onClick: () => {
            handleEndGame();
          },
        },
        confirmBtn: {
          text: "Manche suivante",
          onClick: handleNextRound,
        },
      });
    }
  }, [game]);

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
    const newGame = new Game({
      nbPlayer: game.players.length,
      nbRound: game.nbRound,
    });
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
    setDialog(undefined);
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
    setGame(new Game(game));
    setDialog(undefined);
  }

  /**
   * Termine la partie
   */
  async function handleEndGame() {
    // On réinitialise la grille
    setGrid(
      Array.from({ length: 7 }, () =>
        Array.from({ length: 7 }).fill(new Card({}))
      )
    );
    setGame(new Game());
    setDialog(undefined);
    const success = await game?.endGame();
    if (success) {
      toast({
        title: "Partie terminée",
        description: "La partie a été enregistrée dans la base de données",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la partie",
        action: <XCircle />,
      });
    }
  }

  return (
    <AlertDialog open={dialog !== undefined}>
      <AlertDialogContent className="flex flex-col items-center">
        <AlertDialogHeader>
          <h3>{dialog?.title}</h3>
        </AlertDialogHeader>
        <AlertDialogDescription>{dialog?.description}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={dialog?.cancelBtn.onClick}>
            {dialog?.cancelBtn.text}
          </AlertDialogCancel>
          <AlertDialogAction onClick={dialog?.confirmBtn.onClick}>
            {dialog?.confirmBtn.text}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
