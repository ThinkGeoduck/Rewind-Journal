import { create } from 'zustand';
import { Response } from '../types/response.types';
import { storage } from '../services/storage';

interface ResponseState {
  responses: Response[];
  isLoading: boolean;
  error: string | null;
  initializeStore: () => Promise<void>;
  addResponse: (response: Omit<Response, 'id' | 'createdAt'>) => Promise<void>;
  getResponsesForEntry: (entryId: string) => Response[];
  deleteResponse: (id: string) => Promise<void>;
}

export const useResponseStore = create<ResponseState>((set, get) => ({
  responses: [],
  isLoading: false,
  error: null,

  initializeStore: async () => {
    set({ isLoading: true, error: null });
    try {
      const responses = await storage.getResponses();
      set({ responses });
    } catch (error) {
      set({ error: 'Failed to load responses' });
    } finally {
      set({ isLoading: false });
    }
  },

  addResponse: async (responseData) => {
    set({ isLoading: true, error: null });
    try {
      const newResponse: Response = {
        id: Date.now().toString(),
        createdAt: new Date(),
        ...responseData
      };

      const responses = [...get().responses, newResponse];
      await storage.saveResponses(responses);
      set({ responses });
    } catch (error) {
      set({ error: 'Failed to add response' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getResponsesForEntry: (entryId) => {
    return get().responses
      .filter(response => response.entryId === entryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  deleteResponse: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const responses = get().responses.filter(response => response.id !== id);
      await storage.saveResponses(responses);
      set({ responses });
    } catch (error) {
      set({ error: 'Failed to delete response' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
})); 