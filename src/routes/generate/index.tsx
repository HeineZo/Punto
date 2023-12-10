import Help from "@/components/shared/Help.component";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Game } from "@/types/Game.class";
import {
  Check,
  Database,
  DatabaseZap,
  Leaf,
  Loader2 as Loader,
  Waypoints,
  XCircle,
} from "lucide-react";
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
    database: "mysql",
  });

  /**
   * Génère des parties
   */
  async function handleGenerate() {
    toast({
      title: "Génération des parties.",
      description: `Cette opération peut prendre un certain temps`,
      action: <Loader className="animate-spin" />,
    });
    const [success, data] = await Game.generate(
      formData.nbGame,
      formData.nbPlayer,
      formData.database as "mysql" | "sqlite" | "mongodb" | "neo4j"
    );

    if (success) {
      toast({
        title: "Succès",
        description: data.message,
        action: <Check className="text-green-600" />,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: data.message,
        action: <XCircle />,
      });
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
          <div className="grid w-full gap-4">
            <div className="space-y-2">
              <Label htmlFor="nbGame">Nombre de parties</Label>
              <Input
                id="nbGame"
                name="nbGame"
                placeholder="5"
                type="number"
                defaultValue={5}
                min={1}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    nbGame: Number(event.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nbPlayer">Nombre de joueurs</Label>
              <Select
                defaultValue={formData.nbPlayer.toString()}
                onValueChange={(nbPlayer) =>
                  setFormData({ ...formData, nbPlayer: Number(nbPlayer) })
                }
              >
                <SelectTrigger id="nbPlayer" name="nbPlayer">
                  <SelectValue defaultValue={formData.nbPlayer.toString()} />
                </SelectTrigger>
                <SelectContent position="popper">
                  {Array.from(
                    { length: Game.maxNbPlayer - Game.minNbPlayer + 1 },
                    (_, i) => (
                      <SelectItem
                        key={i + Game.minNbPlayer}
                        value={`${i + Game.minNbPlayer}`}
                      >
                        {i + Game.minNbPlayer}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Choix de la base de données</Label>
              <Tabs
                defaultValue="mysql"
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    database: value,
                  })
                }
              >
                <TabsList>
                  <Help text="MySQL">
                    <TabsTrigger value="mysql">
                      <Database className="h-5 w-5" />
                    </TabsTrigger>
                  </Help>
                  <Help text="SQLite">
                    <TabsTrigger value="sqlite">
                      <DatabaseZap className="h-5 w-5" />
                    </TabsTrigger>
                  </Help>
                  <Help text="Neo4J">
                    <TabsTrigger value="neo4j">
                      <Waypoints className="h-5 w-5" />
                    </TabsTrigger>
                  </Help>
                  {/* TODO: à implémenter
                   <Help text="MongoDB">
                    <TabsTrigger value="mongodb">
                      <Leaf className="h-5 w-5" />
                    </TabsTrigger>
                  </Help> */}
                </TabsList>
              </Tabs>
            </div>
          </div>
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
