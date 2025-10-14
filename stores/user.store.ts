import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

interface UserState {
  name: string | null;
  age: number | null;
  settings: UserSettings;
  setUser: (name: string, age: number) => void;
  clearUser: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: null,
      age: null,
      settings: defaultSettings,
      setUser: (name, age) => set({ name, age }),
      clearUser: () => set({ name: null, age: null }),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 