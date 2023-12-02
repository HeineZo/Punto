import { Card } from '@/types/Card.class';
import { Game } from '@/types/Game.class';
import { atomWithReset } from 'jotai/utils';

export const gameInProgress = atomWithReset<Game>(new Game());
export const gameGrid = atomWithReset(Array.from({ length: 7 }, () => Array.from({ length: 7 }).fill(new Card({}))));