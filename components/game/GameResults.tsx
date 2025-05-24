import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Share,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Share2, Home, Play, Annoyed } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';
import { Pokemon } from '@/utils/types';

interface GameResultsProps {
  isSuccess: boolean;
  score: number;
  pokemon: Pokemon | null;
  onPlayAgain: () => void;
}

export default function GameResults({
  isSuccess,
  score,
  pokemon,
  onPlayAgain
}: GameResultsProps) {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  const handleShare = async () => {
    try {
      const message = isSuccess
        ? `Je viens de trouver ${pokemon?.name} dans PokéGuessWho en marquant ${score} points ! Tu peux battre mon score ?`
        : `Je viens de jouer à PokéGuessWho mais je n'ai pas trouvé ${pokemon?.name}. J'ai marqué ${score} points... Tu peux faire mieux ?`;
        
      if (Platform.OS === 'web') {
        // Web sharing
        if (navigator.share) {
          await navigator.share({
            title: 'Pokémon Guess Who',
            text: message,
          });
        } else {
          alert('Web Share API not supported on this browser');
        }
      } else {
        // Native sharing
        await Share.share({
          message,
        });
      }
    } catch (error) {
      console.error('Error sharing result', error);
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={isSuccess ? [COLORS.success, COLORS.primary] : [COLORS.error, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.resultCard}
      >
        <View style={styles.resultHeader}>
          <View style={styles.resultIconContainer}>
            {isSuccess ? (
              <Trophy size={32} color={COLORS.white} />
            ) : (
              <Annoyed size={32} color={COLORS.white} />
            )}
          </View>
          <Text style={styles.resultTitle}>
            {isSuccess ? 'Bravo !' : 'Dommage !'}
          </Text>
          <Text style={styles.resultSubtitle}>
            {isSuccess 
              ? 'Tu as trouvé le bon Pokémon !'
              : 'Tu n\'as plus de tentatives ou de temps.'
            }
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score :</Text>
          <Text style={styles.scoreValue}>{score} points</Text>
        </View>
        
        {pokemon && (
          <View style={styles.pokemonContainer}>
            <Image
              source={{ uri: pokemon.imageUrl }}
              style={styles.pokemonImage}
              resizeMode="contain"
            />
            <Text style={styles.pokemonName}>{pokemon.name}</Text>
            <View style={styles.pokemonDetails}>
              <Text style={styles.pokemonType}>
                Type : {pokemon.types.join(', ')}
              </Text>
              <Text style={styles.pokemonHeight}>
                Taille : {pokemon.height}m
              </Text>
              <Text style={styles.pokemonWeight}>
                Poids : {pokemon.weight}kg
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Share2 size={16} color={COLORS.white} />
            <Text style={styles.buttonText}>Partager</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playAgainButton}
            onPress={onPlayAgain}
          >
            <Play size={16} color={COLORS.white} />
            <Text style={styles.buttonText}>Rejouer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Home size={16} color={isSuccess ? COLORS.primary : COLORS.secondary} />
            <Text style={[styles.buttonText, styles.homeButtonText]}>
              Accueil
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  resultCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  scoreValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    color: COLORS.white,
  },
  scorePoints: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  pokemonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  pokemonImage: {
    width: 120,
    height: 120,
  },
  pokemonName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  pokemonDetails: {
    alignItems: 'center',
  },
  pokemonType: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  pokemonHeight: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  pokemonWeight: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  shareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 25,
    flex: 1,
    marginRight: 8,
  },
  playAgainButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 25,
    flex: 1,
    marginRight: 8,
  },
  homeButton: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 25,
    flex: 1,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 13,
    color: COLORS.white,
    marginLeft: 8,
  },
  homeButtonText: {
    color: COLORS.textPrimary,
    fontSize: 13,
  },
});