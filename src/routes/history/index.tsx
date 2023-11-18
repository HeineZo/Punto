import { useFetch } from "usehooks-ts";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Game } from "@/types/Game.class";
import { Loader } from "lucide-react";

export default function History() {
  const { data, error } = useFetch<Game[]>(
    "http://localhost:3002/game/findAll"
  );

  if (error) {
    <div className="container mx-auto py-10">
      <h1>Historique des parties</h1>
      <p>Aucune partie n'a encore été jouée</p>
    </div>;
  }

  if (!data) {
    <div className="container mx-auto py-10">
      <h1>Historique des parties</h1>
      <Loader className="animate-spin" />
    </div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1>Historique des parties</h1>
      {/* <DataTable columns={columns} data={data as Game[]} /> */}
    </div>
  );
}
