import { GameState, Hint, Pokemon } from '@/utils/types';
import { fetchRandomPokemon, fetchPokemon, fetchDailyPokemon } from './api';
import { TYPE_FR, STAT_FR, DIFFICULTY_FR } from '@/utils/mapping';

// Generate hints for a Pokémon
const generateHints = (pokemon: Pokemon): Hint[] => {
  return [
    {
      type: 'Silhouette',
      content: 'Révèle la silhouette du Pokémon',
      cost: 0
    },
    {
      type: 'Type',
      content: `Ce Pokémon est ${pokemon.types.length > 1 ? 'double-type' : 'monotype'} : ${pokemon.types.join('/')}`,
      cost: 50
    },
    {
      type: 'Category',
      content: `Ce Pokémon pèse ${pokemon.weight}kg et mesure ${pokemon.height}m`,
      cost: 100
    },
    {
      type: 'Ability',
      content: `Les talents de ce Pokémon incluent : ${pokemon.abilities.join(', ')}`,
      cost: 150
    },
    {
      type: 'Stats',
      content: `Ce Pokémon a une statistique élevée en ${getHighestStat(pokemon.stats)} et plus faible en ${getLowestStat(pokemon.stats)}`,
      cost: 200
    },
    {
      type: 'First Letter',
      content: `Le nom de ce Pokémon commence par "${pokemon.name.charAt(0).toUpperCase()}"`,
      cost: 250
    }
  ];
};

// Get highest stat for a Pokémon
const getHighestStat = (stats: Record<string, number>): string => {
  let highestStat = '';
  let highestValue = 0;
  
  for (const [stat, value] of Object.entries(stats)) {
    if (value > highestValue) {
      highestValue = value;
      highestStat = stat;
    }
  }
  
  return formatStatName(highestStat);
};

// Get lowest stat for a Pokémon
const getLowestStat = (stats: Record<string, number>): string => {
  let lowestStat = '';
  let lowestValue = Infinity;
  
  for (const [stat, value] of Object.entries(stats)) {
    if (value < lowestValue) {
      lowestValue = value;
      lowestStat = stat;
    }
  }
  
  return formatStatName(lowestStat);
};

// Format stat name for display
const formatStatName = (stat: string): string => {
  return STAT_FR[stat.toLowerCase()] || stat;
};

// Start a new game
export const startGame = async (
  mode: 'daily' | 'regular',
  difficulty: 'Easy' | 'Medium' | 'Hard'
): Promise<GameState> => {
  try {
    // Fetch Pokémon based on game mode
    const pokemonOfTheDay = mode === 'daily' 
      ? await fetchDailyPokemon()
      : null;
    const pokemon: Pokemon = pokemonOfTheDay
      ? await fetchPokemon(pokemonOfTheDay.id)
      : await fetchRandomPokemon();
    
    // Generate hints for the Pokémon
    const hints = generateHints(pokemon);
    
    // Set initial game state based on difficulty
    const lives = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 3 : 1;
    const initialScore = difficulty === 'Easy' ? 300 : difficulty === 'Medium' ? 500 : 750;
    
    return {
      currentPokemon: pokemon,
      hints,
      score: initialScore,
      lives,
      gameState: 'playing',
      difficulty,
      revealedHints: [0], // Silhouette hint is always revealed by default
    };
  } catch (error) {
    console.error('Error starting game:', error);
    throw new Error('Failed to start game');
  }
};

// Check if a guess is correct
export const checkGuess = (
  guess: string,
  pokemon: Pokemon | null
): { isCorrect: boolean; feedback?: string } => {
  if (!pokemon) return { isCorrect: false, feedback: 'Aucun Pokémon chargé' };
  
  const normalizedGuess = guess.trim().toLowerCase();
  const normalizedName = pokemon.name.toLowerCase();
  
  if (normalizedGuess === normalizedName) {
    return { isCorrect: true };
  }
  
  // Calculate similarity for feedback
  const similarity = calculateSimilarity(normalizedGuess, normalizedName);
  
  if (similarity > 0.8) {
    return { 
      isCorrect: false, 
      feedback: 'Très proche ! Essaie encore.' 
    };
  } else if (similarity > 0.5) {
    return { 
      isCorrect: false, 
      feedback: 'Pas tout à fait. Continue !' 
    };
  } else {
    return { 
      isCorrect: false, 
      feedback: 'Pas du tout. Tente un autre Pokémon.' 
    };
  }
};

// Calculate string similarity (simple Levenshtein distance)
const calculateSimilarity = (a: string, b: string): number => {
  if (a.length === 0) return 0;
  if (b.length === 0) return 0;
  
  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
  
  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }
  
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost  // substitution
      );
    }
  }
  
  // Convert edit distance to similarity score (0-1)
  const maxLength = Math.max(a.length, b.length);
  return 1 - (matrix[a.length][b.length] / maxLength);
};