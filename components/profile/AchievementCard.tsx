import React from 'react';
import { View, Text, StyleSheet, ProgressBarAndroid, Platform } from 'react-native';
import { 
  Award, 
  Zap, 
  Target, 
  Star, 
  Medal, 
  Trophy 
} from 'lucide-react-native';
import { COLORS } from '@/utils/theme';

type IconName = 'award' | 'zap' | 'target' | 'star' | 'medal' | 'trophy';

interface AchievementCardProps {
  title: string;
  description: string;
  progress: number;
  total: number;
  unlocked: boolean;
  icon: IconName;
}

export default function AchievementCard({ 
  title, 
  description, 
  progress, 
  total, 
  unlocked,
  icon
}: AchievementCardProps) {
  const renderIcon = () => {
    const color = unlocked ? COLORS.accent : COLORS.textTertiary;
    
    switch (icon) {
      case 'award':
        return <Award size={24} color={color} />;
      case 'zap':
        return <Zap size={24} color={color} />;
      case 'target':
        return <Target size={24} color={color} />;
      case 'star':
        return <Star size={24} color={color} />;
      case 'medal':
        return <Medal size={24} color={color} />;
      case 'trophy':
        return <Trophy size={24} color={color} />;
      default:
        return <Award size={24} color={color} />;
    }
  };
  
  const progressPercentage = (progress / total) * 100;

  return (
    <View style={[
      styles.container,
      unlocked && styles.unlockedContainer
    ]}>
      <View style={styles.header}>
        <View style={[
          styles.iconContainer,
          unlocked && styles.unlockedIconContainer
        ]}>
          {renderIcon()}
        </View>
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title,
            unlocked && styles.unlockedTitle
          ]}>
            {title}
          </Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${progressPercentage}%` },
              unlocked && styles.unlockedProgressBar
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {progress}/{total}
        </Text>
      </View>
      
      {unlocked && (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>Unlocked</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  unlockedContainer: {
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  unlockedIconContainer: {
    backgroundColor: COLORS.accent + '33', // 20% opacity
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  unlockedTitle: {
    color: COLORS.accent,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.textSecondary,
    borderRadius: 4,
  },
  unlockedProgressBar: {
    backgroundColor: COLORS.accent,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 36,
    textAlign: 'right',
  },
  unlockedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unlockedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: COLORS.white,
  },
});