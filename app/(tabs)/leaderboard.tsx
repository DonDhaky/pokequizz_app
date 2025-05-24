import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trophy,
  Filter,
  Crown,
  Medal,
  Award,
  RefreshCcw
} from 'lucide-react-native';
import { COLORS } from '@/utils/theme';
import { fetchLeaderboard } from '@/services/api';
import { LeaderboardEntry } from '@/utils/types';

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'all-time'>('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeaderboard(timeframe);
      setLeaderboard(data.leaderboard);
      setUserRank(data.userRank);
    } catch (error) {
      console.error('Failed to load leaderboard', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isTopThree = index < 3;

    return (
      <View style={styles.leaderboardItem}>
        <View style={styles.rankContainer}>
          {isTopThree ? (
            <View style={[styles.topRankBadge, 
              index === 0 ? styles.firstPlace : 
              index === 1 ? styles.secondPlace : 
              styles.thirdPlace
            ]}>
              {index === 0 ? (
                <Crown size={14} color={COLORS.white} />
              ) : index === 1 ? (
                <Medal size={14} color={COLORS.white} />
              ) : (
                <Award size={14} color={COLORS.white} />
              )}
            </View>
          ) : (
            <Text style={styles.rankText}>{index + 1}</Text>
          )}
        </View>
        
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar}
        />
        
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.userStats}>
            {item.totalGuessed} trouvés • {item.accuracy}% précision
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{item.score}</Text>
          <Text style={styles.scoreLabel}>pts</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Classement</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[
              styles.tab,
              timeframe === 'daily' && styles.activeTab
            ]}
            onPress={() => setTimeframe('daily')}
          >
            <Text style={[
              styles.tabText,
              timeframe === 'daily' && styles.activeTabText
            ]}>
              Quotidien
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              timeframe === 'weekly' && styles.activeTab
            ]}
            onPress={() => setTimeframe('weekly')}
          >
            <Text style={[
              styles.tabText,
              timeframe === 'weekly' && styles.activeTabText
            ]}>
              Hebdomadaire
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              timeframe === 'all-time' && styles.activeTab
            ]}
            onPress={() => setTimeframe('all-time')}
          >
            <Text style={[
              styles.tabText,
              timeframe === 'all-time' && styles.activeTabText
            ]}>
              All-time
            </Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.summaryCard}
        >
          <View style={styles.summaryContent}>
            <Trophy size={32} color={COLORS.white} style={styles.summaryIcon} />
            <View>
              <Text style={styles.summaryTitle}>Votre classement</Text>
              <Text style={styles.summaryRank}>
                {userRank ? `#${userRank.rank}` : 'Non classé'}
              </Text>
              <Text style={styles.summaryScore}>
                {userRank ? `${userRank.score} points` : 'Jouez plus pour grimper !'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.leaderboardHeader}>
          <Text style={styles.leaderboardTitle}>Meilleurs joueurs</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadLeaderboard}
          >
            <RefreshCcw size={16} color={COLORS.primary} />
            <Text style={styles.refreshText}>Rafraîchir</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Chargement du classement...</Text>
          </View>
        ) : (
          <FlatList
            data={leaderboard}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLeaderboardItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucune donnée de classement disponible</Text>
              </View>
            }
          />
        )}
      </View>
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
  filterButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    marginRight: 16,
  },
  summaryTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  summaryRank: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 2,
  },
  summaryScore: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  topRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstPlace: {
    backgroundColor: '#FFD700', // Gold
  },
  secondPlace: {
    backgroundColor: '#C0C0C0', // Silver
  },
  thirdPlace: {
    backgroundColor: '#CD7F32', // Bronze
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userStats: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.primary,
  },
  scoreLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});