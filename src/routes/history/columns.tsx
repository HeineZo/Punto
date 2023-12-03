import { Game } from "@/types/Game.class";
import { Player } from "@/types/Player.class";
import { ColumnDef } from "@tanstack/react-table";
import { intervalToDuration, formatDuration, format, fromUnixTime } from "date-fns";

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "id",
    header: "Identifiant de la partie",
  },
  {
    accessorKey: "winner",
    header: "Gagnant",
    cell: ({ row }) => {
      const duration = Number(row.getValue("duration"));
      if (duration <= 0) {
        return (
          <p className="font-bold text-red-500 animate-pulse">• En cours</p>
        );
      }
      const winner = new Player(row.getValue("winner"));
      if (!winner.id) {
        return <p className="font-bold text-blue-500">Egalité</p>;
      }

      return winner.pseudo;
    },
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
      // On convertit le timestamp en date
      const date = fromUnixTime(row.getValue("createdAt"));
      return format(date, "dd/MM/yyyy");
    },
  },
];
