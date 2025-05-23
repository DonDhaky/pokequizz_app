import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';
import { Hint } from '@/utils/types';

interface HintSystemProps {
  hints: Hint[];
  revealedHints: number[];
  onRevealHint: (index: number) => void;
  score: number;
}

export default function HintSystem({ 
  hints, 
  revealedHints, 
  onRevealHint,
  score 
}: HintSystemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Hints</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hintsContainer}
      >
        {hints.map((hint, index) => {
          const isRevealed = revealedHints.includes(index);
          const canAfford = score >= hint.cost;
          
          return (
            <TouchableOpacity 
              key={index}
              style={[
                styles.hintCard,
                isRevealed && styles.revealedHint,
                !canAfford && !isRevealed && styles.unaffordableHint
              ]}
              onPress={() => canAfford && !isRevealed && onRevealHint(index)}
              disabled={isRevealed || !canAfford}
            >
              <View style={styles.hintHeader}>
                <Lightbulb 
                  size={16} 
                  color={isRevealed ? COLORS.accent : COLORS.textSecondary} 
                />
                <Text style={[
                  styles.hintCost,
                  isRevealed && styles.revealedText,
                  !canAfford && !isRevealed && styles.unaffordableText
                ]}>
                  {isRevealed ? 'Revealed' : `${hint.cost} pts`}
                </Text>
              </View>
              
              <Text style={[
                styles.hintType,
                isRevealed && styles.revealedText,
                !canAfford && !isRevealed && styles.unaffordableText
              ]}>
                {hint.type}
              </Text>
              
              {isRevealed ? (
                <Text style={styles.hintContent}>{hint.content}</Text>
              ) : (
                <Text style={styles.lockedText}>
                  {canAfford ? 'Tap to reveal' : 'Not enough points'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  hintsContainer: {
    paddingRight: 16,
  },
  hintCard: {
    width: 150,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  revealedHint: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  unaffordableHint: {
    opacity: 0.7,
  },
  hintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hintCost: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  hintType: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  hintContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  lockedText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
  },
  revealedText: {
    color: COLORS.accent,
  },
  unaffordableText: {
    color: COLORS.textTertiary,
  },
});