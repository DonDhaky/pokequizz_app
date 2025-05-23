import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  Zap, 
  Percent, 
  Clock, 
  Trophy,
  Flame,
  Calendar 
} from 'lucide-react-native';
import { COLORS } from '@/utils/theme';

type IconName = 'zap' | 'percent' | 'clock' | 'trophy' | 'flame' | 'calendar';

interface StatsCardProps {
  title: string;
  value: string;
  icon: IconName;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'zap':
        return <Zap size={24} color={COLORS.accent} />;
      case 'percent':
        return <Percent size={24} color={COLORS.accent} />;
      case 'clock':
        return <Clock size={24} color={COLORS.accent} />;
      case 'trophy':
        return <Trophy size={24} color={COLORS.accent} />;
      case 'flame':
        return <Flame size={24} color={COLORS.accent} />;
      case 'calendar':
        return <Calendar size={24} color={COLORS.accent} />;
      default:
        return <Zap size={24} color={COLORS.accent} />;
    }
  };

  return (
    <View style={styles.statCard}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});