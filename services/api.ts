import { 
  Pokemon, 
  PokemonOfTheDay,
  LeaderboardEntry,
  UserProfile
} from '@/utils/types';

// Mock API for fetchDailyPokemon
export const fetchDailyPokemon = async (): Promise<PokemonOfTheDay> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    id: 25,
    name: 'Pikachu',
    imageUrl: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
    silhouetteUrl: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
};

// Mock API for fetchPokemon
export const fetchPokemon = async (id: number): Promise<Pokemon> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    id,
    name: 'Pikachu',
    types: ['Électrik'],
    height: 0.4,
    weight: 6.0,
    abilities: ['Statik', 'Paratonnerre'],
    stats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90
    },
    imageUrl: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
    silhouetteUrl: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
  };
};

// Mock API for fetchRandomPokemon
export const fetchRandomPokemon = async (): Promise<Pokemon> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Generate random ID between 1 and 151 (Gen 1 Pokémon)
  const randomId = Math.floor(Math.random() * 151) + 1;
  
  // Return mock data
  return {
    id: randomId,
    name: 'Dracaufeu',
    types: ['Feu', 'Vol'],
    height: 1.7,
    weight: 90.5,
    abilities: ['Brasier', 'Force Soleil'],
    stats: {
      hp: 78,
      attack: 84,
      defense: 78,
      specialAttack: 109,
      specialDefense: 85,
      speed: 100
    },
    imageUrl: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
    silhouetteUrl: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
  };
};

// Mock API for fetchLeaderboard
export const fetchLeaderboard = async (
  timeframe: 'daily' | 'weekly' | 'all-time'
): Promise<{ leaderboard: LeaderboardEntry[], userRank: LeaderboardEntry }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    {
      id: 1,
      username: 'Sacha',
      score: 9500,
      rank: 1,
      avatar: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
      totalGuessed: 145,
      accuracy: 92,
    },
    {
      id: 2,
      username: 'Ondine',
      score: 8750,
      rank: 2,
      avatar: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
      totalGuessed: 132,
      accuracy: 88,
    },
    {
      id: 3,
      username: 'Pierre',
      score: 8200,
      rank: 3,
      avatar: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
      totalGuessed: 128,
      accuracy: 85,
    },
    {
      id: 4,
      username: 'Régis',
      score: 7800,
      rank: 4,
      avatar: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
      totalGuessed: 120,
      accuracy: 82,
    },
    {
      id: 5,
      username: 'Professeur Chen',
      score: 7500,
      rank: 5,
      avatar: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
      totalGuessed: 115,
      accuracy: 80,
    },
    {
      id: 6,
      username: 'Team Rocket',
      score: 7200,
      rank: 6,
      avatar: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
      totalGuessed: 110,
      accuracy: 78,
    },
    {
      id: 7,
      username: 'Infirmière Joëlle',
      score: 6800,
      rank: 7,
      avatar: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
      totalGuessed: 105,
      accuracy: 75,
    },
  ];
  
  // Mock user rank
  const userRank: LeaderboardEntry = {
    id: 999,
    username: 'Joueur',
    score: 5200,
    rank: 42,
    avatar: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
    totalGuessed: 78,
    accuracy: 68,
  };
  
  return { leaderboard, userRank };
};

// Mock API for fetchUserProfile
export const fetchUserProfile = async (): Promise<UserProfile> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock user profile data
  return {
    id: 999,
    username: 'PokéMaster',
    email: 'player@example.com',
    totalGuessed: 124,
    highScore: 8700,
    accuracy: 68,
    streak: 5,
    avgTime: 28,
    gamesPlayed: 182,
    winRate: 72,
    typePerformance: [
      { type: 'Electric', accuracy: 92 },
      { type: 'Water', accuracy: 85 },
      { type: 'Fire', accuracy: 78 },
      { type: 'Grass', accuracy: 62 },
      { type: 'Psychic', accuracy: 45 },
    ],
    achievements: [
      {
        id: 1,
        title: 'Premier essai',
        description: 'Trouve ton premier Pokémon',
        progress: 1,
        total: 1,
        unlocked: true,
        icon: 'award'
      },
      {
        id: 2,
        title: 'Maître Poké',
        description: 'Trouve 100 Pokémon correctement',
        progress: 124,
        total: 100,
        unlocked: true,
        icon: 'trophy'
      },
      {
        id: 3,
        title: 'Série parfaite',
        description: 'Maintiens une série de 7 jours',
        progress: 5,
        total: 7,
        unlocked: false,
        icon: 'star'
      },
      {
        id: 4,
        title: 'Rapide comme l\'éclair',
        description: 'Trouve 10 Pokémon en moins de 10 secondes chacun',
        progress: 7,
        total: 10,
        unlocked: false,
        icon: 'zap'
      },
      {
        id: 5,
        title: 'Maître des types',
        description: 'Trouve des Pokémon de tous les 18 types',
        progress: 12,
        total: 18,
        unlocked: false,
        icon: 'target'
      }
    ]
  };
};