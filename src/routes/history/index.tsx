import Header from "@/components/shared/Header";
import { DataTable } from "@/components/ui/data-table";
import { Game } from "@/types/Game.class";
import { Loader } from "lucide-react";
import { useFetch } from "usehooks-ts";
import { columns } from "./columns";

export default function History() {
  const { data, error } = useFetch<Game[]>(
    "http://localhost:3002/game/findAll"
  );

  if (error) {
    <div className="container space-y-10 py-10">
      <Header title="Historique des parties" />
      <p>Aucune partie n'a encore été jouée</p>
    </div>;
  }

  if (!data) {
    <div className="container space-y-10 py-10">
      <Header title="Historique des parties" />
      <Loader className="animate-spin" />
    </div>;
  }

  return (
    <div className="container space-y-10 py-10">
      <Header title="Historique des parties" />
      <DataTable
        columns={columns}
        data={data ? data.map((game) => new Game(game)) : []}
      />
    </div>
  );
}
