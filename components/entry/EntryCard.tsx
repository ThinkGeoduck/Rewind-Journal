import { Pressable, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../layout/ThemeProvider';
import { Entry } from '../../types/entry.types';
import { useCallback, memo } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface EntryCardProps {
  entry: Entry;
}

export const EntryCard = memo(function EntryCard({ entry }: EntryCardProps) {
  const { theme } = useTheme();
  
  const isUnlockable = useCallback(() => {
    const now = new Date();
    const unlockDate = new Date(entry.unlockDate);
    return now >= unlockDate;
  }, [entry.unlockDate]);

  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const getEmotionColor = () => {
    // This is a simple example - you might want to add more emotions and colors
    const emotions = {
      happy: theme.colors.success,
      sad: theme.colors.accent1,
      neutral: theme.colors.accent2,
      angry: theme.colors.error,
    };
    return emotions.neutral; // Default color
  };

  const handlePress = useCallback(() => {
    router.push(`/entry/${entry.id}`);
  }, [entry.id]);

  return (
    <Pressable 
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        { opacity: pressed ? 0.9 : 1 }
      ]}
    >
      <View 
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.card,
            ...theme.shadows.small,
          }
        ]}
      >
        <View style={styles.dateContainer}>
          <Text style={[styles.day, { color: theme.colors.textSecondary }]}>
            {new Date(entry.createdAt).getDate()}
          </Text>
          <Text style={[styles.month, { color: theme.colors.textSecondary }]}>
            {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short' })}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text 
              style={[styles.title, { color: theme.colors.text }]}
              numberOfLines={1}
            >
              {entry.title || 'Untitled Entry'}
            </Text>
            {!entry.isUnlocked && (
              <View style={[styles.lockStatus, { backgroundColor: isUnlockable() ? theme.colors.success : theme.colors.accent2 }]}>
                <Ionicons 
                  name={isUnlockable() ? "lock-open-outline" : "lock-closed-outline"} 
                  size={14} 
                  color="white" 
                />
                <Text style={styles.lockText}>
                  {isUnlockable() ? 'Ready' : 'Locked'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {entry.isUnlocked 
                ? `Opened ${formatDate(entry.unlockDate)}`
                : `Opens ${formatDate(entry.unlockDate)}`}
            </Text>
            {entry.mediaUrls?.length > 0 && (
              <View style={styles.mediaIndicator}>
                <Ionicons name="mic-outline" size={16} color={theme.colors.primary} />
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressable: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  dateContainer: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    width: 60,
  },
  day: {
    fontSize: 20,
    fontWeight: '600',
  },
  month: {
    fontSize: 14,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  lockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  lockText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  mediaIndicator: {
    padding: 4,
  },
}); 