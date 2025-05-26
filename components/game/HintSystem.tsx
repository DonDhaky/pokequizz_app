import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Lightbulb } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';
import { Hint } from '@/utils/types';
import { HINT_TYPE_FR } from '@/utils/mapping';
import { MotiView } from 'moti';
import { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

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
      <Text style={styles.title}>Indices disponibles</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hintsContainer}
      >
        {hints.slice(1).map((hint, i) => {
          const index = i + 1;
          const isRevealed = revealedHints.includes(index);
          const canAfford = score >= hint.cost;
          
          // Animation de flip
          const rotateY = useSharedValue(0);
          const [showBack, setShowBack] = useState(false);

          useEffect(() => {
            if (isRevealed) {
              rotateY.value = withTiming(180, { duration: 500 });
              setTimeout(() => setShowBack(true), 250); // mi-animation
            } else {
              rotateY.value = withTiming(0, { duration: 500 });
              setShowBack(false);
            }
          }, [isRevealed]);

          const cardStyle = useAnimatedStyle(() => ({
            transform: [
              { perspective: 800 },
              { rotateY: `${rotateY.value}deg` }
            ]
          }));

          const frontStyle = useAnimatedStyle(() => ({
            opacity: rotateY.value <= 90 ? 1 : 0,
            width: '100%',
            backfaceVisibility: 'hidden',
          }));
          const backStyle = useAnimatedStyle(() => ({
            opacity: rotateY.value > 90 ? 1 : 0,
            width: '100%',
            backfaceVisibility: 'hidden',
            transform: [{ rotateY: '180deg' }, { scaleX: -1 }],
          }));

          return (
            <MotiView
              key={index}
              style={[
                styles.hintCard,
                isRevealed && styles.revealedHint,
                !canAfford && !isRevealed && styles.unaffordableHint,
                { overflow: 'hidden' },
                cardStyle
              ]}
            >
              {/* Face avant */}
              {!showBack && (
                <TouchableOpacity
                  style={[frontStyle]}
                  onPress={() => canAfford && !isRevealed && onRevealHint(index)}
                  disabled={isRevealed || !canAfford}
                  activeOpacity={0.8}
                >
                  <View style={styles.hintHeader}>
                    <Lightbulb 
                      size={16} 
                      color={COLORS.textSecondary} 
                    />
                    <Text style={[
                      styles.hintCost,
                      !canAfford && styles.unaffordableText
                    ]}>
                      {`${hint.cost} pts`}
                    </Text>
                  </View>
                  
                  <Text style={[
                    styles.hintType,
                    !canAfford && styles.unaffordableText
                  ]}>
                    {HINT_TYPE_FR[hint.type]}
                  </Text>
                  
                  <Text style={styles.lockedText}>
                    {canAfford ? 'Appuie pour révéler' : 'Pas assez de points'}
                  </Text>
                </TouchableOpacity>
              )}
              {/* Face arrière */}
              {showBack && (
                <View style={[backStyle]}>
                  <View style={styles.hintHeader}>
                    <Lightbulb 
                      size={16} 
                      color={COLORS.accent} 
                    />
                    <Text style={[styles.hintCost, styles.revealedText, { transform: [{ scaleX: -1 }] }]}>
                      Révélé
                    </Text>
                  </View>
                  
                  <Text style={[styles.hintType, styles.revealedText, { transform: [{ scaleX: -1 }] }]}>
                    {HINT_TYPE_FR[hint.type]}
                  </Text>
                  
                  <Text style={[styles.hintContent, { transform: [{ scaleX: -1 }] }]}>{hint.content}</Text>
                </View>
              )}
            </MotiView>
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
    marginBottom: 8,
  },
  hintCard: {
    width: 150,
    minHeight: 140,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'flex-start',
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