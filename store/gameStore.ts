import { create } from 'zustand';
import { GameState, Pokemon, Hint } from '@/utils/types';

interface GameStore extends GameState {
  initGame: (gameState: GameState) => void;
  revealHint: (hintIndex: number) => void;
  updateScore: (newScore: number) => void;
  updateLives: (newLives: number) => void;
  setGameState: (state: 'playing' | 'success' | 'failure') => void;
  resetGame: () => void;
}

// Initial state
const initialState: GameState = {
  currentPokemon: null,
  hints: [],
  score: 0,
  lives: 3,
  gameState: 'playing',
  difficulty: 'Medium',
  revealedHints: [0],
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  
  // Initialize game with new state
  initGame: (gameState: GameState) => set(gameState),
  
  // Reveal a hint
  revealHint: (hintIndex: number) => set((state) => ({
    revealedHints: [...state.revealedHints, hintIndex]
  })),
  
  // Update score
  updateScore: (newScore: number) => set({ score: newScore }),
  
  // Update lives
  updateLives: (newLives: number) => set({ lives: newLives }),
  
  // Set game state
  setGameState: (gameState: 'playing' | 'success' | 'failure') => set({ gameState }),
  
  // Reset game to initial state
  resetGame: () => set(initialState),
}));