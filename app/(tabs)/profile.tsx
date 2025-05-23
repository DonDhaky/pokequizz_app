import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Settings, User, Award, ChartBar as BarChart3, Share2, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/utils/theme';
import { useUserStore } from '@/store/userStore';
import AchievementCard from '@/components/profile/AchievementCard';
import StatisticsCard from '@/components/profile/StatisticsCard';
import { fetchUserProfile } from '@/services/api';
import { UserProfile } from '@/utils/types';

export default function ProfileScreen() {
  const { user, setUser, logout } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to load user profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1310847/pexels-photo-1310847.jpeg' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.username || 'Trainer'}</Text>
            <Text style={styles.profileRank}>Rank: Pokémon Master</Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.totalGuessed || 0}</Text>
                <Text style={styles.statLabel}>Guessed</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.highScore || 0}</Text>
                <Text style={styles.statLabel}>High Score</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user?.accuracy || 0}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'stats' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('stats')}
          >
            <BarChart3
              size={18}
              color={activeTab === 'stats' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'stats' && styles.activeTabText
              ]}
            >
              Statistics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'achievements' && styles.activeTabButton
            ]}
            onPress={() => setActiveTab('achievements')}
          >
            <Award
              size={18}
              color={activeTab === 'achievements' ? COLORS.primary : COLORS.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'achievements' && styles.activeTabText
              ]}
            >
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'stats' ? (
          <View style={styles.statisticsContainer}>
            <StatisticsCard
              title="Daily Streak"
              value={user?.streak || 0}
              icon="flame"
              change={+2}
            />
            <StatisticsCard
              title="Pokémon Guessed"
              value={user?.totalGuessed || 0}
              icon="zap"
              change={+12}
            />
            <StatisticsCard
              title="Accuracy Rate"
              value={`${user?.accuracy || 0}%`}
              icon="percent"
              change={-3}
            />
            <StatisticsCard
              title="Avg. Time"
              value={`${user?.avgTime || 0}s`}
              icon="clock"
              change={-1.5}
            />
            
            <Text style={styles.sectionTitle}>Performance by Type</Text>
            <View style={styles.typePerformance}>
              {user?.typePerformance?.map((type, index) => (
                <View key={index} style={styles.typeItem}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.typeIcon, { opacity: type.accuracy / 100 }]}
                  >
                    <Text style={styles.typeIconText}>{type.type.charAt(0)}</Text>
                  </LinearGradient>
                  <View style={styles.typeInfo}>
                    <Text style={styles.typeName}>{type.type}</Text>
                    <Text style={styles.typeAccuracy}>{type.accuracy}% accuracy</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.achievementsContainer}>
            {user?.achievements?.map((achievement, index) => (
              <AchievementCard
                key={index}
                title={achievement.title}
                description={achievement.description}
                progress={achievement.progress}
                total={achievement.total}
                unlocked={achievement.unlocked}
                icon={achievement.icon}
              />
            ))}
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 size={20} color={COLORS.primary} />
            <Text style={styles.actionButtonText}>Share Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={logout}
          >
            <LogOut size={20} color={COLORS.error} />
            <Text style={[styles.actionButtonText, styles.logoutText]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Pokémon Guess Who • v1.0.0
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
  profileSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  profileRank: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.accent,
    marginBottom: 12,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 25,
  },
  activeTabButton: {
    backgroundColor: COLORS.backgroundSecondary,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  statisticsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 16,
  },
  typePerformance: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIconText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  typeInfo: {
    marginLeft: 12,
  },
  typeName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  typeAccuracy: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  achievementsContainer: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButton: {
    backgroundColor: COLORS.backgroundSecondary,
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 8,
  },
  logoutText: {
    color: COLORS.error,
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