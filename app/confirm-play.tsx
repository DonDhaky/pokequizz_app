import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/utils/theme';
import { ArrowLeft } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

export default function ConfirmPlayScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const [slideOut, setSlideOut] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleStart = () => {
    setSlideOut(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <MotiView
        from={{ opacity: 1, translateX: 0 }}
        animate={{
          opacity: slideOut ? 0 : 1,
          translateX: slideOut ? -500 : 0,
        }}
        transition={{
          type: 'timing',
          duration: 400,
          easing: Easing.inOut(Easing.ease),
        }}
        onDidAnimate={(key, finished) => {
          if (key === 'translateX' && slideOut && finished) {
            router.replace({ pathname: '/play', params: { mode } });
          }
        }}
        style={styles.container}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Prêt à relever le défi ?</Text>
        <Text style={styles.subtitle}>Tu vas avoir 60 secondes pour deviner le Pokémon mystère. Bonne chance !</Text>
        <MotiView
          from={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            duration: 400,
          }}
          style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>C'est parti !</Text>
          </TouchableOpacity>
        </MotiView>
      </MotiView>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 2,
    padding: 8,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  startButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.white,
  },
}); 