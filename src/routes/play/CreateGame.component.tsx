import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
import { Trash, Plus } from "lucide-react";
import { useState } from "react";

import { MagicMotion } from "react-magic-motion";
import { Link } from "react-router-dom";

export default function CreateGame() {
  const [players, setPlayers] = useState<string[]>(["", ""]);

  const min = 2;
  const max = 5;

  // Désactive le bouton de démarrage si il n'y a pas au moins 2 joueurs
  const disableStartButton =
    players.filter(
      (element) => typeof element === "string" && element.trim() !== ""
    ).length < 2;

  // Désactive le bouton de suppression de joueurs si il n'y a pas au moins 2 joueurs
  const disableDeletePlayers = players.length <= 2;

  function handleStart() {
    console.log("starting");
  }

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
  return (
    <Card className="min-w-[350px]">
      <CardHeader>
        <CardTitle>Commencer à jouer</CardTitle>
        <CardDescription>Ajouter les joueurs de la partie</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <MagicMotion>
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
            <Button variant="secondary" className="w-fit" onClick={addPlayer}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un joueur
            </Button>
          </div>
        </MagicMotion>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nbPlayer">Nombre de manches pour gagner</Label>
          <Select defaultValue={min.toString()}>
            <SelectTrigger
              id="nbRound"
              name="nbRound"
              //   onChange={handleChange}
            >
              <SelectValue defaultValue={min} />
            </SelectTrigger>
            <SelectContent position="popper">
              {Array.from({ length: max - min + 1 }, (_, i) => (
                <SelectItem key={i + min} value={`${i + min}`}>
                  {i + min}
                </SelectItem>
              ))}
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
