import { create } from 'zustand';
import { UserProfile } from '@/utils/types';

interface UserStore {
  user: UserProfile | null;
  isLoggedIn: boolean;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  updateUserStats: (stats: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoggedIn: false,
  
  // Set user profile
  setUser: (user: UserProfile) => set({ 
    user,
    isLoggedIn: true 
  }),
  
  // Logout user
  logout: () => set({ 
    user: null,
    isLoggedIn: false 
  }),
  
  // Update user statistics
  updateUserStats: (stats: Partial<UserProfile>) => set((state) => ({
    user: state.user ? { ...state.user, ...stats } : null
  })),
}));