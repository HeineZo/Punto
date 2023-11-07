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
import { Link } from "react-router-dom";

export default function Generate() {
  const min = 2;
  const max = 8;
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
          <form>
            <div className="grid w-full gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nbGame">Nombre de parties</Label>
                <Input
                  id="nbGame"
                  placeholder="5"
                  type="number"
                  defaultValue={5}
                  min={1}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="nbPlayer">Nombre de joueurs</Label>
                <Select defaultValue={min.toString()}>
                  <SelectTrigger id="nbPlayer">
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
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">Retour</Link>
          </Button>
          <Button>Générer</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
