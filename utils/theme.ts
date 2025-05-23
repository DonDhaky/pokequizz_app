export const COLORS = {
  // Primary colors
  primary: '#E3350D',     // Pokéball red
  secondary: '#30A7D7',   // Pokémon blue
  accent: '#FFCB05',      // Pokémon yellow
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F6F8FA',
  cardBackground: '#FFFFFF',
  silhouetteBackground: '#1E293B',
  
  // Text colors
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  
  // Status colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  
  // UI elements
  border: '#E2E8F0',
  shadow: '#000000',
  white: '#FFFFFF',
  black: '#000000',
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};