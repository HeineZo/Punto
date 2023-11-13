import { Link } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";

/**
 * Page d'accueil
 */
export default function App() {
  return (
    <main className="h-full flex flex-col justify-center items-center gap-12">
      <h1 className="text-6xl">Punto</h1>
      <div className="flex flex-col gap-6">
        <Button disabled>Jouer</Button>
        <Button asChild variant="outline">
          <Link to="/history">Voir l'historique</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/generate">Générer des parties</Link>
        </Button>
      </div>
    </main>
  );
}
