import { Link } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";
import { useFetch } from "usehooks-ts";

/**
 * Page d'accueil
 */
export default function App() {
  const { data, error } = useFetch<string>(
    "http://localhost:3002/api/game/getAll"
  );

  return (
    <main className="h-full flex flex-col justify-center items-center gap-12">
      <h1 className="text-6xl">Punto</h1>
      {data}
      <div className="flex flex-col gap-6">
        <Button>Jouer</Button>
        <Button asChild variant="secondary">
          <Link to="/generate">Générer des parties</Link>
        </Button>
      </div>
    </main>
  );
}
