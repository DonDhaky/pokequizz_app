import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';

// Mock data for recent games
const recentGames = [
  {
    id: '1',
    pokemonName: 'Pikachu',
    imageUrl: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
    score: 780,
    date: '2h ago',
    guessTime: '22s',
    difficulty: 'Easy'
  },
  {
    id: '2',
    pokemonName: 'Charizard',
    imageUrl: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
    score: 520,
    date: '4h ago',
    guessTime: '35s',
    difficulty: 'Medium'
  },
  {
    id: '3',
    pokemonName: 'Mewtwo',
    imageUrl: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg',
    score: 950,
    date: '1d ago',
    guessTime: '18s',
    difficulty: 'Hard'
  }
];

interface RecentGamesProps {
  mode?: 'horizontal' | 'vertical';
}

export default function RecentGames({ mode = 'horizontal' }: RecentGamesProps) {
  const router = useRouter();

  if (mode === 'vertical') {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Parties récentes</Text>
        </View>
        <View style={styles.verticalListContainer}>
          {recentGames.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={styles.verticalGameCard}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Image
                source={{ uri: game.imageUrl }}
                style={styles.verticalGameImage}
              />
              <View style={styles.gameInfo}>
                <View style={styles.gameHeader}>
                  <Text style={styles.gamePokemon}>{game.pokemonName}</Text>
                  <View style={[
                    styles.difficultyBadge,
                    game.difficulty === 'Easy' ? styles.easyBadge :
                    game.difficulty === 'Medium' ? styles.mediumBadge : styles.hardBadge
                  ]}>
                    <Text style={styles.difficultyText}>{game.difficulty}</Text>
                  </View>
                </View>
                <View style={styles.gameStats}>
                  <Text style={styles.gameScore}>{game.score} pts</Text>
                  <Text style={styles.gameDate}>{game.date}</Text>
                </View>
                <Text style={styles.guessTime}>Trouvé en {game.guessTime}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Parties récentes</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Tout voir</Text>
          <ChevronRight size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recentGamesContainer}
      >
        {recentGames.map((game) => (
          <TouchableOpacity 
            key={game.id} 
            style={styles.gameCard}
            onPress={() => router.push('/(tabs)/game-history')}
          >
            <Image 
              source={{ uri: game.imageUrl }} 
              style={styles.gameImage} 
            />
            <View style={styles.gameInfo}>
              <View style={styles.gameHeader}>
                <Text style={styles.gamePokemon}>{game.pokemonName}</Text>
                <View style={[
                  styles.difficultyBadge,
                  game.difficulty === 'Easy' ? styles.easyBadge : 
                  game.difficulty === 'Medium' ? styles.mediumBadge : styles.hardBadge
                ]}>
                  <Text style={styles.difficultyText}>{game.difficulty}</Text>
                </View>
              </View>
              <View style={styles.gameStats}>
                <Text style={styles.gameScore}>{game.score} pts</Text>
                <Text style={styles.gameDate}>{game.date}</Text>
              </View>
              <Text style={styles.guessTime}>Trouvé en {game.guessTime}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
  recentGamesContainer: {
    paddingRight: 16,
  },
  gameCard: {
    width: 200,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  gameImage: {
    width: '100%',
    height: 100,
  },
  gameInfo: {
    padding: 12,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gamePokemon: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  easyBadge: {
    backgroundColor: COLORS.success + '33', // 20% opacity
  },
  mediumBadge: {
    backgroundColor: COLORS.warning + '33', // 20% opacity
  },
  hardBadge: {
    backgroundColor: COLORS.error + '33', // 20% opacity
  },
  difficultyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: COLORS.textPrimary,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gameScore: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.accent,
  },
  gameDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  guessTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  verticalListContainer: {
    gap: 16,
  },
  verticalGameCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
    padding: 8,
  },
  verticalGameImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
});