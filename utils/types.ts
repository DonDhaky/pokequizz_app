// Pokemon types
export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  imageUrl: string;
  silhouetteUrl: string;
}

export interface PokemonOfTheDay {
  id: number;
  name: string;
  imageUrl: string;
  silhouetteUrl: string;
  expiresAt: string;
}

// Game types
export interface Hint {
  type: string;
  content: string;
  cost: number;
}

export interface GameState {
  currentPokemon: Pokemon | null;
  hints: Hint[];
  score: number;
  lives: number;
  gameState: 'playing' | 'success' | 'failure';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  revealedHints: number[];
}

// User types
export interface UserProfile {
  id: number;
  username: string;
  email?: string;
  totalGuessed: number;
  highScore: number;
  accuracy: number;
  streak: number;
  avgTime: number;
  gamesPlayed?: number;
  winRate?: number;
  typePerformance: {
    type: string;
    accuracy: number;
  }[];
  achievements: Achievement[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  progress: number;
  total: number;
  unlocked: boolean;
  icon: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  rank: number;
  avatar: string;
  totalGuessed: number;
  accuracy: number;
}