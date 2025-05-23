import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/utils/theme';
import { 
  Play, 
  Trophy, 
  Info, 
  Settings,
  ChevronRight 
} from 'lucide-react-native';
import { fetchDailyPokemon } from '@/services/api';
import { PokemonOfTheDay } from '@/utils/types';
import RecentGames from '@/components/home/RecentGames';
import StatsCard from '@/components/home/StatsCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [dailyPokemon, setDailyPokemon] = useState<PokemonOfTheDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDailyPokemon = async () => {
      try {
        const pokemon = await fetchDailyPokemon();
        setDailyPokemon(pokemon);
      } catch (error) {
        console.error('Failed to load daily Pokémon', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDailyPokemon();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Pokémon Guess Who</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <LinearGradient 
          colors={[COLORS.primary, COLORS.secondary]} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }} 
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Ready to play?</Text>
            <Text style={styles.heroSubtitle}>
              Test your Pokémon knowledge!
            </Text>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => router.push('/(tabs)/play')}
            >
              <Play size={20} color={COLORS.primary} />
              <Text style={styles.playButtonText}>Play Now</Text>
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg' }} 
            style={styles.heroImage} 
            resizeMode="contain"
          />
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Challenge</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Info size={16} color={COLORS.primary} />
              <Text style={styles.seeAllText}>How to Play</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.dailyCard}
            onPress={() => router.push('/(tabs)/play?mode=daily')}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading daily challenge...</Text>
              </View>
            ) : (
              <>
                <View style={styles.dailyContent}>
                  <Text style={styles.dailyTitle}>Pokémon of the Day</Text>
                  <Text style={styles.dailySubtitle}>
                    New challenge every 24 hours
                  </Text>
                  <View style={styles.dailyStats}>
                    <Text style={styles.dailyStatsText}>
                      Difficulty: <Text style={styles.dailyHighlight}>Medium</Text>
                    </Text>
                    <Text style={styles.dailyStatsText}>
                      Bonus Points: <Text style={styles.dailyHighlight}>2x</Text>
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.dailyButton}>
                    <Text style={styles.dailyButtonText}>Play Challenge</Text>
                    <ChevronRight size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.silhouetteContainer}>
                  {dailyPokemon && (
                    <Image 
                      source={{ uri: dailyPokemon.silhouetteUrl }} 
                      style={styles.silhouetteImage} 
                      resizeMode="contain"
                    />
                  )}
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <StatsCard title="Pokémon Guessed" value="124" icon="zap" />
          <StatsCard title="Accuracy" value="68%" icon="percent" />
        </View>

        <RecentGames />

        <TouchableOpacity 
          style={styles.leaderboardButton}
          onPress={() => router.push('/(tabs)/leaderboard')}
        >
          <Trophy size={20} color={COLORS.white} />
          <Text style={styles.leaderboardButtonText}>View Leaderboard</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by PokéAPI • v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: Platform.OS === 'android' ? 16 : 0,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  settingsButton: {
    padding: 8,
  },
  heroCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: COLORS.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 8,
  },
  heroImage: {
    width: width * 0.25,
    height: '100%',
    opacity: 0.9,
  },
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
    marginLeft: 4,
  },
  dailyCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  dailyContent: {
    flex: 2,
  },
  dailyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  dailySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  dailyStats: {
    marginBottom: 16,
  },
  dailyStatsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dailyHighlight: {
    fontFamily: 'Inter-Bold',
    color: COLORS.accent,
  },
  dailyButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  dailyButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.white,
    marginRight: 4,
  },
  silhouetteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.silhouetteBackground,
    borderRadius: 12,
    marginLeft: 12,
    overflow: 'hidden',
  },
  silhouetteImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  leaderboardButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 24,
  },
  leaderboardButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.white,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textTertiary,
  },
});