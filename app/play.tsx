import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Animated,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, CircleHelp as HelpCircle, Lightbulb, Clock, Heart, Search } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';
import { useGameStore } from '@/store/gameStore';
import HintSystem from '@/components/game/HintSystem';
import GameControls from '@/components/game/GameControls';
import GuessInput from '@/components/game/GuessInput';
import GameResults from '@/components/game/GameResults';
import { startGame, checkGuess } from '@/services/gameLogic';
import { getDifficultySettings } from '@/utils/helpers';
import { DIFFICULTY_FR } from '@/utils/mapping';
import { MotiView } from 'moti';

export default function PlayScreen() {
  const { mode } = useLocalSearchParams();
  const {
    currentPokemon,
    hints,
    score,
    lives,
    gameState,
    difficulty,
    revealedHints,
    initGame,
    revealHint,
    updateScore,
    updateLives,
    setGameState
  } = useGameStore();
  
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [shakeInput, setShakeInput] = useState(false);
  const [showErrorColor, setShowErrorColor] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const silhouetteOpacity = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  useEffect(() => {
    const gameMode = mode === 'daily' ? 'daily' : 'regular';
    const settings = getDifficultySettings(difficulty);
    
    // Start new game
    startGame(gameMode, difficulty).then(initialGameState => {
      initGame(initialGameState);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    });
    
    // Start timer
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleRevealHint = (hintIndex: number) => {
    if (revealedHints.includes(hintIndex)) return;
    
    revealHint(hintIndex);
    updateScore(score - hints[hintIndex].cost);
    
    if (hintIndex === 0) {
      // Reveal silhouette
      Animated.timing(silhouetteOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      }).start();
    }
  };

  const handleGuess = () => {
    if (!guess.trim()) return;
    
    const result = checkGuess(guess, currentPokemon);
    
    if (result.isCorrect) {
      setIsCorrect(true);
      updateScore(score + (remainingTime * 10));
      setGameState('success');
      setTimeout(() => {
        setShowResults(true);
      }, 1500);
    } else {
      setGuess('');
      updateLives(lives - 1);
      setShakeInput(true);
      setShowErrorColor(true);
      setErrorCount((c) => c + 1);
      setTimeout(() => {
        setShakeInput(false);
        setShowErrorColor(false);
      }, 500);
      
      if (lives <= 1) {
        setGameState('failure');
        setTimeout(() => {
          setShowResults(true);
        }, 1000);
      }
    }
  };

  const handleTimeUp = () => {
    updateLives(0);
    setGameState('failure');
    setTimeout(() => {
      setShowResults(true);
    }, 1000);
  };

  const handlePlayAgain = () => {
    setShowResults(false);
    setGuess('');
    setIsCorrect(false);
    setRemainingTime(60);
    
    const gameMode = mode === 'daily' ? 'daily' : 'regular';
    
    // Reset animations
    silhouetteOpacity.setValue(1);
    fadeAnim.setValue(0);
    
    // Start new game
    startGame(gameMode, difficulty).then(initialGameState => {
      initGame(initialGameState);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    });
  };

  const handleBackPress = () => {
    Alert.alert(
      'Quitter la partie',
      'Es-tu sûr de vouloir quitter ? La partie sera perdue.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            setGameState('failure');
            setTimeout(() => {
              router.push('/');
            }, 300);
          }
        }
      ]
    );
  };

  if (showResults) {
    return (
      <GameResults 
        isSuccess={gameState === 'success'} 
        score={score}
        pokemon={currentPokemon}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'daily' ? 'Défi du jour' : 'Devine le Pokémon'}
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <HelpCircle size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.gameInfo}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{DIFFICULTY_FR[difficulty] || difficulty}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Clock size={16} color={COLORS.textSecondary} />
              <Text style={styles.statText}>{remainingTime}s</Text>
            </View>
            
            <View style={styles.statItem}>
              <Heart size={16} color={COLORS.error} />
              <Text style={styles.statText}>{lives} vies</Text>
            </View>
            
            <View style={styles.statItem}>
              <Lightbulb size={16} color={COLORS.accent} />
              <Text style={styles.statText}>{score} pts</Text>
            </View>
          </View>
        </View>
        
        <Animated.View 
          style={[
            styles.pokemonContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.imageContainer}>
            {currentPokemon && (
              <>
                <Image 
                  source={{ uri: currentPokemon.imageUrl }} 
                  style={styles.pokemonImage} 
                  resizeMode="contain"
                />
                <Animated.View 
                  style={[
                    styles.silhouette,
                    { opacity: silhouetteOpacity }
                  ]}
                >
                  <Image 
                    source={{ uri: currentPokemon.silhouetteUrl }} 
                    style={styles.silhouetteImage} 
                    resizeMode="contain"
                  />
                </Animated.View>
              </>
            )}
          </View>
          
          <HintSystem 
            hints={hints}
            revealedHints={revealedHints}
            onRevealHint={handleRevealHint}
            score={score}
          />
          
          <GuessInput
            value={guess}
            onChangeText={setGuess}
            onSubmit={handleGuess}
            isCorrect={isCorrect}
            showError={showErrorColor}
          />
          
          <GameControls 
            onSkip={() => {
              updateLives(lives - 1);
              setGuess('');
              
              if (lives <= 1) {
                setGameState('failure');
                setTimeout(() => {
                  setShowResults(true);
                }, 1000);
              }
            }}
            remainingTime={remainingTime}
          />
        </Animated.View>
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
    marginBottom: 16,
    marginTop: Platform.OS === 'android' ? 8 : 0,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  helpButton: {
    padding: 8,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  difficultyBadge: {
    backgroundColor: COLORS.accent,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  difficultyText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: COLORS.white,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  pokemonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  pokemonImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  silhouette: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.silhouetteBackground,
    borderRadius: 16,
  },
  silhouetteImage: {
    width: '100%',
    height: '100%',
  },
});