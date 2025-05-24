import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { COLORS } from '@/utils/theme';

export default function GameHistory() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ChevronLeft size={24} color={COLORS.primary} />
        <Text style={styles.title}>Historique des parties</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.info}>
          Sélectionne une partie récente pour voir ses détails.
        </Text>
        <Text style={styles.soon}>
          (Fonctionnalité à venir)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  soon: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.warning,
  },
});