import { gameInProgress } from "@/utils/store";
import { useAtom } from "jotai";
import CreateGame from "./CreateGame.component";

import GameHeader from "./GameHeader.component";

export default function PlayGame() {
  const [game, setGame] = useAtom(gameInProgress);

  if (!game?.id) {
    return (
      <main className="flex w-full justify-center items-center">
        <CreateGame />
      </main>
    );
  }

  return (
    <main className="container">
      <GameHeader />
    </main>
  );
}
