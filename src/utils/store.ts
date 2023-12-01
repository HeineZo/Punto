import { Card } from '@/types/Card.class';
import { Game } from '@/types/Game.class';
import { atom } from 'jotai'

export const gameInProgress = atom<Game>(new Game());
export const gameGrid = atom(Array.from({ length: 7 }, () => Array.from({ length: 7 }).fill(new Card({}))));