import { Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import { History, Dices } from "lucide-react";

/**
 * Page d'accueil
 */
export default function App() {
  return (
    <main className="h-full flex flex-col justify-center items-center gap-12">
      <h1 className="text-6xl">Punto</h1>
      <div className="flex flex-col gap-6">
        <Button asChild>
          <Link to="/play">Jouer</Link>
        </Button>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/history">
              <History className="mr-2 h-4 w-4" />
              Voir l'historique
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/generate">
              <Dices className="mr-2 h-4 w-4" />
              Générer des parties
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
