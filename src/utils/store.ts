import { Game } from '@/types/Game.class';
import { atom } from 'jotai'

export const gameInProgress = atom<Game>(new Game());