import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Game } from "@/types/Game.class";
import { Player } from "@/types/Player.class";
import { useAtom } from "jotai";
import { Plus, Trash, XCircle } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { gameInProgress } from "@/utils/store";
import { Link } from "react-router-dom";

export default function CreateGame() {
  const [game, setGame] = useAtom(gameInProgress);
  const { toast } = useToast();

  const [players, setPlayers] = useState<string[]>(
    new Array(Game.minNbPlayer).fill("")
  );
  const [nbRound, setNbRound] = useState<number>(Game.minNbRound);

  // Désactive le bouton de démarrage si il n'y a pas au moins 2 joueurs
  const disableStartButton =
    players.filter(
      (element) => typeof element === "string" && element.trim() !== ""
    ).length < Game.minNbPlayer;

  // Désactive le bouton de suppression de joueurs si il n'y a pas au moins le nombre minimum de joueurs
  const disableDeletePlayers = players.length <= Game.minNbPlayer;
  // Désactive le bouton d'ajout de joueurs si il y a déjà le nombre maximum de joueurs
  const disableAddPlayers = players.length >= Game.maxNbPlayer;

  /**
   * Lorsqu'un joueur change de nom, met à jour la liste des joueurs
   * @param index Indice l'input qui contient le pseudo du nouveau joueur
   * @param event Evénement de changement de valeur
   */
  function handlePlayersChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const data = [...players];
    data[index] = event.target.value;
    setPlayers(data);
  }

  /**
   * Ajoute un joueur à la liste
   */
  function addPlayer() {
    setPlayers([...players, ""]);
  }

  /**
   * Supprime le joueur de la liste à l'index donné
   * @param index Indice du joueur à supprimer
   */
  function deletePlayer(index: number) {
    const data = [...players];
    data.splice(index, 1);
    setPlayers(data);
  }

  /**
   * Démarre la partie
   */
  async function handleStart() {
    const newGame = new Game({ nbPlayer: players.length, nbRound });
    for (const player of players) {
      newGame.addPlayer(new Player({ pseudo: player }));
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

  return (
    <Card className="min-w-[350px]">
      <CardHeader>
        <CardTitle>Commencer à jouer</CardTitle>
        <CardDescription>Ajouter les joueurs de la partie</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {players.map((player, index) => (
            <div className="flex gap-2" key={index}>
              <Input
                value={player}
                id={`player-${index}`}
                name={`player-${index}`}
                placeholder="John Doe"
                onChange={(event) => handlePlayersChange(index, event)}
              />
              <Button
                disabled={disableDeletePlayers}
                variant="destructive"
                size="icon"
                onClick={() => deletePlayer(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            className="w-fit"
            onClick={addPlayer}
            disabled={disableAddPlayers}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un joueur
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nbPlayer">Nombre de manches pour gagner</Label>
          <Select
            defaultValue={nbRound.toString()}
            onValueChange={(nbRound) => setNbRound(Number(nbRound))}
          >
            <SelectTrigger id="nbRound" name="nbRound">
              <SelectValue defaultValue={nbRound} />
            </SelectTrigger>
            <SelectContent position="popper">
              {Array.from(
                { length: Game.maxNbRound - Game.minNbRound + 1 },
                (_, i) => (
                  <SelectItem
                    key={i + Game.minNbRound}
                    value={`${i + Game.minNbRound}`}
                  >
                    {i + Game.minNbRound}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link to="/">Retour</Link>
        </Button>
        <Button onClick={handleStart} disabled={disableStartButton}>
          Démarrer
        </Button>
      </CardFooter>
    </Card>
  );
}
