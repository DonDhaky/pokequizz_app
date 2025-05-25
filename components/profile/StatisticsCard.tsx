import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Flame,
  Zap,
  Percent,
  Clock
} from 'lucide-react-native';
import { COLORS } from '@/utils/theme';
import { TYPE_FR, STAT_FR, DIFFICULTY_FR } from '@/utils/mapping';

type IconName = 'flame' | 'zap' | 'percent' | 'clock';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  icon: IconName;
  change: number;
}

export default function StatisticsCard({
  title,
  value,
  icon,
  change
}: StatisticsCardProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'flame':
        return <Flame size={20} color={COLORS.accent} />;
      case 'zap':
        return <Zap size={20} color={COLORS.accent} />;
      case 'percent':
        return <Percent size={20} color={COLORS.accent} />;
      case 'clock':
        return <Clock size={20} color={COLORS.accent} />;
      default:
        return <Zap size={20} color={COLORS.accent} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {renderIcon()}
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <View style={[
          styles.changeBadge,
          change > 0 ? styles.increaseBadge : styles.decreaseBadge
        ]}>
          <Text
            style={[
              styles.changeText,
              { color: change > 0 ? COLORS.success : COLORS.error }
            ]}
          >
            {change > 0 ? '+' : ''}{change}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  changeBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  increaseBadge: {
    backgroundColor: COLORS.success + '33', // 20% opacity
  },
  decreaseBadge: {
    backgroundColor: COLORS.error + '33', // 20% opacity
  },
  changeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});