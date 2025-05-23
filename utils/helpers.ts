import { Platform } from 'react-native';

// Get difficulty settings based on difficulty level
export const getDifficultySettings = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  switch (difficulty) {
    case 'Easy':
      return {
        lives: 5,
        initialScore: 300,
        timeLimit: 90,
        availableHints: 6,
      };
    case 'Medium':
      return {
        lives: 3,
        initialScore: 500,
        timeLimit: 60,
        availableHints: 4,
      };
    case 'Hard':
      return {
        lives: 1,
        initialScore: 750,
        timeLimit: 45,
        availableHints: 2,
      };
    default:
      return {
        lives: 3,
        initialScore: 500,
        timeLimit: 60,
        availableHints: 4,
      };
  }
};

// Calculate points based on remaining time and difficulty
export const calculatePoints = (
  remainingTime: number,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  hintsUsed: number
) => {
  const difficultyMultiplier = 
    difficulty === 'Easy' ? 1 :
    difficulty === 'Medium' ? 1.5 :
    2.5;
  
  const hintPenalty = hintsUsed * 0.1;
  const timeBonus = Math.floor(remainingTime * 5);
  
  return Math.floor((timeBonus * difficultyMultiplier) * (1 - hintPenalty));
};

// Check if device is online
export const isOnline = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return navigator.onLine;
  }
  
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/1', {
      method: 'HEAD',
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Format time in seconds to MM:SS format
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Normalize Pokemon name for comparison
export const normalizePokemonName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove special characters
    .trim();
};

// Sort leaderboard entries by score
export const sortLeaderboard = (
  entries: { score: number }[]
): { score: number }[] => {
  return [...entries].sort((a, b) => b.score - a.score);
};