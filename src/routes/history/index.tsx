import { useFetch } from "usehooks-ts";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Game } from "@/types/Game.class";

export default function History() {
  const { data, error } = useFetch<Game[]>(
    "http://localhost:3002/game/findAll"
  );

  console.log(data);
  if (error) {
    <div className="container mx-auto py-10">
      <h1>Historique des parties</h1>
    </div>;
  }

  if (!data) {
    <div className="container mx-auto py-10">
      <h1>Historique des parties</h1>
    </div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1>Historique des parties</h1>
      <DataTable columns={columns} data={data as Game[]} />
    </div>
  );
}
