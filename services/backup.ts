import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MediaService } from './media';

const BACKUP_DIR = `${FileSystem.documentDirectory}backups/`;

export const BackupService = {
  async createBackup() {
    try {
      // Ensure backup directory exists
      const dirInfo = await FileSystem.getInfoAsync(BACKUP_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(BACKUP_DIR, { intermediates: true });
      }

      // Get all AsyncStorage data
      const allKeys = await AsyncStorage.getAllKeys();
      const allData = await AsyncStorage.multiGet(allKeys);
      const backupData = Object.fromEntries(allData);

      // Create backup file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `${BACKUP_DIR}backup-${timestamp}.json`;
      
      await FileSystem.writeAsStringAsync(
        backupPath,
        JSON.stringify(backupData),
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      return backupPath;
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw new Error('Failed to create backup');
    }
  },

  async restoreBackup(backupPath: string) {
    try {
      // Read backup file
      const backupContent = await FileSystem.readAsStringAsync(backupPath);
      const backupData = JSON.parse(backupContent);

      // Clear current data
      await AsyncStorage.clear();
      await MediaService.clearMediaDirectory();

      // Restore data
      for (const [key, value] of Object.entries(backupData)) {
        await AsyncStorage.setItem(key, value as string);
      }

      return true;
    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw new Error('Failed to restore backup');
    }
  },

  async listBackups(): Promise<string[]> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(BACKUP_DIR);
      if (!dirInfo.exists) {
        return [];
      }

      const backups = await FileSystem.readDirectoryAsync(BACKUP_DIR);
      return backups.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  },

  async deleteBackup(filename: string) {
    try {
      await FileSystem.deleteAsync(`${BACKUP_DIR}${filename}`);
    } catch (error) {
      console.error('Failed to delete backup:', error);
      throw new Error('Failed to delete backup');
    }
  },
}; 