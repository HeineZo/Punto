import Header from "@/components/shared/Header";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Game } from "@/types/Game.class";
import { Loader } from "lucide-react";
import { useFetch } from "usehooks-ts";
import { columns } from "./columns";
import { useState } from "react";

export default function History() {
  const [database, setDatabase] = useState("mysql");
  const { data, error } = useFetch<Game[]>(`http://localhost:3002/game?db=${database}`);

  /**
   * Change la base de données dont on veut récupérer les données
   * @param database Base de
   */
  function changeDatabase(database: string) {
    setDatabase(database);
  }

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
      <div className="space-y-5">
        <Tabs defaultValue={database} className="w-[400px]" onValueChange={changeDatabase}>
          <TabsList>
            <TabsTrigger value="mysql">MySQL</TabsTrigger>
            <TabsTrigger value="sqlite">SQLite</TabsTrigger>
            <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
          </TabsList>
        </Tabs>
        <DataTable
          columns={columns}
          data={data ? data.map((game) => new Game(game)) : []}
        />
      </div>
    </div>
  );
}
