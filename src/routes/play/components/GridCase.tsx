import { Card } from "@/types/Card.class";
import { Game } from "@/types/Game.class";
import { Range } from "@/types/type";
import { gameGrid, gameInProgress } from "@/utils/store";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import GameCard from "./GameCard.component";
import { useToast } from "@/components/ui/use-toast";
import { XCircle } from "lucide-react";

type Props = {
  rowPosition: Range<1, 7>;
  colPosition: Range<1, 7>;
};
/**
 * Case de la grille de jeu
 * @param rowPosition Position de la case sur la ligne
 * @param colPosition Position de la case sur la colonne
 */
export default function GridCase({ rowPosition, colPosition }: Props) {
  const { toast } = useToast();
  const [game, setGame] = useAtom(gameInProgress);
  const [grid, setGrid] = useAtom(gameGrid);
  const currentCard = grid[rowPosition - 1][colPosition - 1] as Card;
  const [isDisabled, setDisabled] = useState<boolean>(false);

  // Vérifier si la case est la case du milieu
  const isMiddleCell = rowPosition === 4 && colPosition === 4;

  useEffect(() => {
    // S'il s'agit de la case du milieu, elle ne peut jamais être désactivée
    if (isMiddleCell) {
      return;
    }
    // Récupérer les cartes adjacentes
    const adjacentCards = Card.getAdjacentCards(
      rowPosition - 1,
      colPosition - 1,
      grid
    );

    // Désactiver la case si les cartes adjacentes ne sont pas définies
    if (adjacentCards) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [game, rowPosition, colPosition, grid, isMiddleCell]);

  /**
   * Place la carte sur la grille
   */
  function handleClick() {
    // Vérifier si la case est désactivée
    if (isDisabled) {
      return;
    }

    // Récupérer la carte à placer
    const cardToPlace = game?.getCurrentPlayer()?.getCardToPlay();
    if (!cardToPlace) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer la carte à placer",
        action: <XCircle />,
      });
      return;
    }
    cardToPlace.colPosition = colPosition;
    cardToPlace.rowPosition = rowPosition;

    // Si la carte est plus petite que la carte courante, on ne la place pas
    if (currentCard) {
      const cardToPlaceValue = cardToPlace.value ?? 0;
      const currentCardValue = currentCard?.value ?? 0;
      if (cardToPlaceValue <= currentCardValue) {
        return;
      }
    }

    // On place la carte sur la grille
    game?.placeCard(rowPosition, colPosition);
    grid[rowPosition - 1][colPosition - 1] = cardToPlace;

    // setCurrentCard(cardToPlace);
    setGrid([...grid]);
    setGame(new Game(game));
  }

  return (
    <div
      className={clsx(
        !currentCard?.isCard() && "border-2",
        isDisabled && "bg-gray-600 cursor-not-allowed",
        "border-gray-600 w-[50px] h-[50px] rounded-[5px] flex justify-center items-center"
      )}
      onClick={handleClick}
    >
      <GameCard card={currentCard ?? null} />
    </div>
  );
}
