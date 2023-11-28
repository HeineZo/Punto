/// <reference types="vite-plugin-svgr/client" />
import { Card } from "@/types/Card.class";
import Card1 from "/src/assets/game/card1.svg?react";
import Card2 from "/src/assets/game/card2.svg?react";
import Card3 from "/src/assets/game/card3.svg?react";
import Card4 from "/src/assets/game/card4.svg?react";
import Card5 from "/src/assets/game/card5.svg?react";
import Card6 from "/src/assets/game/card6.svg?react";
import Card7 from "/src/assets/game/card7.svg?react";
import Card8 from "/src/assets/game/card8.svg?react";
import Card9 from "/src/assets/game/card9.svg?react";

const svgCards = [
  Card1,
  Card2,
  Card3,
  Card4,
  Card5,
  Card6,
  Card7,
  Card8,
  Card9,
];

type Props = {
  card: Card | null;
};

export default function GameCard({ card }: Props) {
  const CardSVG = svgCards[Number(card?.value)-1];
  const colorVariants = {
    blue: "text-blue-500",
    red: "text-red-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
  };
  return CardSVG && (<CardSVG className={colorVariants[card?.color ?? "blue"]} />)
}
