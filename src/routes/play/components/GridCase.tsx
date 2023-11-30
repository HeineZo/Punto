import { Card } from "@/types/Card.class";
import { Range } from "@/types/type";
import { gameInProgress } from "@/utils/store";
import { useAtom } from "jotai";
import { useState } from "react";
import GameCard from "./GameCard.component";
import clsx from "clsx";
import { Game } from "@/types/Game.class";

type Props = {
  rowPosition: Range<1, 7>;
  colPosition: Range<1, 7>;
};
/**
 * Case de la grille de jeu
 */
export default function GridCase({ rowPosition, colPosition }: Props) {
  const [game, setGame] = useAtom(gameInProgress);
  const [currentCard, setCurrentCard] = useState<Card>();

  function handleClick() {
    setCurrentCard(game?.getCurrentPlayer()?.getCardToPlay());
    game?.placeCard(rowPosition, colPosition);
    setGame(new Game(game));
  }

  return (
    <div
      className={clsx(
        !currentCard && "border-2",
        "border-gray-600 w-[50px] h-[50px] rounded-[5px] flex justify-center items-center"
      )}
      onClick={handleClick}
    >
      <GameCard card={currentCard ?? null} />
    </div>
  );
}
