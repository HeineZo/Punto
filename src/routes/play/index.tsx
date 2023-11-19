import { useAtom } from "jotai";
import CreateGame from "./CreateGame.component";
import { gameInProgress } from "@/utils/store";

export default function PlayGame() {
  const [game, setGame] = useAtom(gameInProgress);
  return (
    <main className="flex w-full justify-center items-center">
      {!game?.id && <CreateGame />}
    </main>
  );
}
