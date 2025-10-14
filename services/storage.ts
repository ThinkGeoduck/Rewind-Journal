import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entry } from '../types/entry.types';
import { Response } from '../types/response.types';

const ENTRIES_KEY = '@journal_entries';
const RESPONSES_KEY = '@journal_responses';

export const storage = {
  async saveEntries(entries: Entry[]) {
    try {
      await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  },

  async getEntries(): Promise<Entry[]> {
    try {
      const entries = await AsyncStorage.getItem(ENTRIES_KEY);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Error getting entries:', error);
      return [];
    }
  },

  async saveResponses(responses: Response[]) {
    try {
      await AsyncStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
    } catch (error) {
      console.error('Error saving responses:', error);
    }
  },

  async getResponses(): Promise<Response[]> {
    try {
      const responses = await AsyncStorage.getItem(RESPONSES_KEY);
      return responses ? JSON.parse(responses) : [];
    } catch (error) {
      console.error('Error getting responses:', error);
      return [];
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.multiRemove([ENTRIES_KEY, RESPONSES_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}; 