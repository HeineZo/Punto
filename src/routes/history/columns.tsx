import { Game } from "@/types/Game.class"
import { ColumnDef } from "@tanstack/react-table"


export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "id",
    header: "Identifiant de la partie",
  },
  {
    accessorKey: "idWinner",
    header: "Gagnant",
  },
  {
    accessorKey: "nbPlayer",
    header: "Nombre de joueurs dans la partie",
  },
  {
    accessorKey: "nbMove",
    header: "Nombre de coups joués",
  },
  {
    accessorKey: "duration",
    header: "Durée",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
]
