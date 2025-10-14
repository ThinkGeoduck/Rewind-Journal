import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Configure notifications to use default sound
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Enable default device sound
    shouldSetBadge: true,
  }),
});

export interface Entry {
  id: string;
  title: string;
  content: string;
  unlockDate: Date;
  mediaUrls: string[];
  isUnlocked: boolean;
  emotion: number;
  stressLevel: number;
  createdAt: Date;
}

interface EntryState {
  entries: Entry[];
  initialized: boolean;
  initializeEntries: () => void;
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt'>) => Promise<boolean>;
  updateEntry: (id: string, updates: Partial<Entry>) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<boolean>;
  getEntry: (id: string) => Entry | undefined;
}

export const useEntryStore = create<EntryState>()(
  persist(
    (set, get) => ({
      entries: [],
      initialized: false,

      initializeEntries: () => {
        if (!get().initialized) {
          set({ initialized: true });
        }
      },

      addEntry: async (entryData) => {
        try {
          const newEntry: Entry = {
            id: Date.now().toString(),
            createdAt: new Date(),
            ...entryData,
          };

          // Schedule notification for when entry unlocks
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Your Journal Entry is Ready! 📝",
              body: `Time to unlock "${newEntry.title || 'your entry'}"`,
              sound: 'default', // Use device's default notification sound
              data: { entryId: newEntry.id },
            },
            trigger: {
              date: new Date(newEntry.unlockDate),
            },
          });

          set((state) => ({
            entries: [...state.entries, newEntry],
          }));

          return true;
        } catch (error) {
          console.error('Failed to add entry:', error);
          return false;
        }
      },

      updateEntry: async (id, updates) => {
        try {
          set((state) => ({
            entries: state.entries.map((entry) =>
              entry.id === id ? { ...entry, ...updates } : entry
            ),
          }));
          return true;
        } catch (error) {
          console.error('Failed to update entry:', error);
          return false;
        }
      },

      deleteEntry: async (id) => {
        try {
          set((state) => ({
            entries: state.entries.filter((entry) => entry.id !== id),
          }));
          return true;
        } catch (error) {
          console.error('Failed to delete entry:', error);
          return false;
        }
      },

      getEntry: (id) => {
        return get().entries.find((entry) => entry.id === id);
      },
    }),
    {
      name: 'entry-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        entries: state.entries.map((entry) => ({
          ...entry,
          createdAt: entry.createdAt.toISOString(),
          unlockDate: entry.unlockDate.toISOString(),
        })),
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.entries) {
          state.entries = state.entries.map((entry) => ({
            ...entry,
            createdAt: new Date(entry.createdAt),
            unlockDate: new Date(entry.unlockDate),
          }));
        }
      },
    }
  )
); 