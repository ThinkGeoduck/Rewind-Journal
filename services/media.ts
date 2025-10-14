import * as FileSystem from 'expo-file-system';
import { EntryMedia } from '../types/entry.types';

const MEDIA_DIR = `${FileSystem.documentDirectory}media/`;

export const MediaService = {
  async init() {
    const dirInfo = await FileSystem.getInfoAsync(MEDIA_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(MEDIA_DIR, { intermediates: true });
    }
  },

  async saveMedia(uri: string, type: EntryMedia['type']): Promise<string> {
    await this.init();
    
    const filename = `${Date.now()}.${type === 'audio' ? 'm4a' : 'mp4'}`;
    const newUri = `${MEDIA_DIR}${filename}`;
    
    await FileSystem.copyAsync({
      from: uri,
      to: newUri,
    });

    return newUri;
  },

  async deleteMedia(uri: string) {
    try {
      await FileSystem.deleteAsync(uri);
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  },

  async clearMediaDirectory() {
    try {
      await FileSystem.deleteAsync(MEDIA_DIR);
    } catch (error) {
      console.error('Error clearing media directory:', error);
    }
  },
}; 