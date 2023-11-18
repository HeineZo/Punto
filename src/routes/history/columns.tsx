import { Game } from "@/types/Game.class";
import { ColumnDef } from "@tanstack/react-table";
import { intervalToDuration, formatDuration, format } from "date-fns";

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "id",
    header: "Identifiant de la partie",
  },
  {
    accessorKey: "winner.pseudo",
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
    cell: ({ row }) => {
      // On récupère les secondes
      const seconds = Number(row.getValue("duration"));
      // On convertit les secondes en millisecondes
      const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
      // On ajoute un 0 devant les nombres inférieurs à 10
      const zeroPad = (num: number) => String(num).padStart(2, "0");
      // On formatte les secondes de manière à les afficher sous la forme d'un temps
      const formatted = formatDuration(duration, {
        format: ["minutes", "seconds"],
        zero: true,
        delimiter: ":",
        locale: {
          formatDistance: (_token, count) => zeroPad(count),
        },
      });
      return formatted;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      // On formatte la date
      const date = new Date(row.getValue("createdAt"));
      return format(date, "dd/MM/yyyy");
    },
  },
];
