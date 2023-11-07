import { Link } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <main className="h-full flex flex-col justify-center items-center gap-12">
      <h1 className="text-6xl">Punto</h1>
      <div className="flex flex-col gap-6">
        <Button>Jouer</Button>
        <Button asChild variant="secondary">
          <Link to="/generate">Générer des parties</Link>
        </Button>
      </div>
    </main>
  );
}

export default App;
