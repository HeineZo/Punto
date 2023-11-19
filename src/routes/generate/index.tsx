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
import { useToast } from "@/components/ui/use-toast";
import { Game } from "@/types/Game.class";
import { Check, Loader2 as Loader, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Page de génération de parties
 */
export default function Generate() {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nbGame: 5,
    nbPlayer: Game.minNbPlayer,
  });

  /**
   * Génère des parties
   */
  async function handleGenerate() {
    try {
      toast({
        title: "Génération des parties.",
        description: `Cette opération peut prendre un certain temps`,
        action: <Loader className="animate-spin" />,
      });
      const res = await fetch("http://localhost:3002/game/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nbGame: formData.nbGame,
          nbPlayer: formData.nbPlayer,
        }),
      });

      const data = await res.json();
      toast({
        title: "Succès",
        description: data.message,
        action: <Check className="text-green-600" />,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue",
        action: <XCircle />,
      });
      console.error(error);
    }
  }

  return (
    <main className="flex w-full justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Générer des parties</CardTitle>
          <CardDescription>
            Créer des parties avec des données aléatoires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate}>
            <div className="grid w-full gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nbGame">Nombre de parties</Label>
                <Input
                  id="nbGame"
                  name="nbGame"
                  placeholder="5"
                  type="number"
                  defaultValue={5}
                  min={1}
                  onChange={(event) => setFormData({...formData, nbGame: Number(event.target.value)})}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="nbPlayer">Nombre de joueurs</Label>
                <Select
                  defaultValue={formData.nbPlayer.toString()}
                  onValueChange={(nbPlayer) => setFormData({...formData, nbPlayer: Number(nbPlayer) })}
                >
                  <SelectTrigger id="nbPlayer" name="nbPlayer">
                    <SelectValue defaultValue={formData.nbPlayer.toString()} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {Array.from({ length: Game.maxNbPlayer - Game.minNbPlayer + 1 }, (_, i) => (
                      <SelectItem key={i + Game.minNbPlayer} value={`${i + Game.minNbPlayer}`}>
                        {i + Game.minNbPlayer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">Retour</Link>
          </Button>
          <Button onClick={handleGenerate}>Générer</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
