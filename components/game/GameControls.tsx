import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { 
  SkipForward, 
  Clock 
} from 'lucide-react-native';
import { COLORS } from '@/utils/theme';

interface GameControlsProps {
  onSkip: () => void;
  remainingTime: number;
}

export default function GameControls({ onSkip, remainingTime }: GameControlsProps) {
  // Format remaining time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Clock size={16} color={remainingTime < 10 ? COLORS.error : COLORS.textSecondary} />
        <Text 
          style={[
            styles.timeText,
            remainingTime < 10 && styles.timeWarning
          ]}
        >
          {formatTime(remainingTime)}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={onSkip}
      >
        <SkipForward size={16} color={COLORS.white} />
        <Text style={styles.skipText}>Skip (-1 life)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  timeWarning: {
    color: COLORS.error,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textSecondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  skipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 4,
  },
});