import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Screen } from '../../../components/layout/Screen';
import { Button } from '../../../components/common/Button';
import { useTheme } from '../../../components/layout/ThemeProvider';
import { BackupService } from '../../../services/backup';
import { Loading } from '../../../components/common/Loading';

export default function BackupScreen() {
  const { theme } = useTheme();
  const [backups, setBackups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadBackups = async () => {
    const files = await BackupService.listBackups();
    setBackups(files);
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      await BackupService.createBackup();
      await loadBackups();
      Alert.alert('Success', 'Backup created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    Alert.alert(
      'Restore Backup',
      'This will replace all current data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await BackupService.restoreBackup(`${filename}`);
              Alert.alert('Success', 'Backup restored successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to restore backup');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteBackup = async (filename: string) => {
    Alert.alert(
      'Delete Backup',
      'Are you sure you want to delete this backup?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await BackupService.deleteBackup(filename);
              await loadBackups();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete backup');
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBackups();
    setRefreshing(false);
  };

  if (loading) {
    return <Loading message="Processing..." />;
  }

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.colors.text }]}>Backups</Text>
      
      <Button
        title="Create New Backup"
        onPress={handleCreateBackup}
        style={styles.createButton}
      />

      <FlatList
        data={backups}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View style={[styles.backupItem, { borderColor: theme.colors.border }]}>
            <Text style={[styles.backupName, { color: theme.colors.text }]}>
              {item}
            </Text>
            <View style={styles.actions}>
              <Button
                title="Restore"
                onPress={() => handleRestoreBackup(item)}
                variant="secondary"
              />
              <Button
                title="Delete"
                onPress={() => handleDeleteBackup(item)}
                variant="secondary"
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  createButton: {
    marginBottom: 24,
  },
  backupItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  backupName: {
    fontSize: 16,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
}); 