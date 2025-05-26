import React, { useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  Animated,
  Platform
} from 'react-native';
import { Search, Check } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';

interface GuessInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isCorrect: boolean;
  showError?: boolean;
}

export default function GuessInput({ 
  value, 
  onChangeText, 
  onSubmit,
  isCorrect,
  showError = false
}: GuessInputProps) {
  const inputRef = useRef<TextInput>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const correctAnim = useRef(new Animated.Value(0)).current;
  
  // useEffect(() => {
  //   if (Platform.OS !== 'web') {
  //     setTimeout(() => {
  //       inputRef.current?.focus();
  //     }, 500);
  //   }
  // }, []);
  
  useEffect(() => {
    if (isCorrect) {
      Animated.timing(correctAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
  }, [isCorrect]);
  
  const handleSubmitEditing = () => {
    if (!value.trim()) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
      return;
    }
    
    onSubmit();
  };

  const inputContainerStyle = {
    transform: [
      { translateX: shakeAnim },
      {
        scale: correctAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.05, 1]
        })
      }
    ],
    backgroundColor: correctAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.cardBackground, COLORS.success + '33'] // Adding 33 for opacity
    }),
    borderColor: correctAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.border, COLORS.success]
    })
  };

  return (
    <Animated.View style={[
      styles.container,
      inputContainerStyle,
      showError && { borderColor: COLORS.error, backgroundColor: COLORS.error + '11' }
    ]}>
      {isCorrect ? (
        <Check size={20} color={COLORS.success} style={styles.icon} />
      ) : (
        <Search size={20} color={COLORS.textSecondary} style={styles.icon} />
      )}
      
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Entre ta réponse..."
        placeholderTextColor={COLORS.textTertiary}
        onSubmitEditing={handleSubmitEditing}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isCorrect}
      />
      
      <TouchableOpacity 
        style={[
          styles.submitButton,
          isCorrect && styles.correctButton
        ]}
        onPress={handleSubmitEditing}
        disabled={isCorrect}
      >
        <Text style={styles.submitText}>
          {isCorrect ? 'Bien joué !' : 'Valider'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  correctButton: {
    backgroundColor: COLORS.success,
  },
  submitText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.white,
  },
});