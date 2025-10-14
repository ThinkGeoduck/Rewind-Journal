import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Screen } from '../../../components/layout/Screen';
import { Button } from '../../../components/common/Button';
import { useTheme } from '../../../components/layout/ThemeProvider';
import { useEntryStore } from '../../../stores/entry.store';
import { ResponseForm } from '../../../components/entry/ResponseForm';
import { useResponseStore } from '../../../stores/response.store';
import { MediaPlayer } from '../../../components/entry/MediaPlayer';
import { LoadingOverlay } from '../../../components/common/LoadingOverlay';
import { ErrorToast } from '../../../components/common/ErrorToast';
import { useState, useEffect, useMemo, useCallback } from 'react';

export default function EntryDetail() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const getEntry = useEntryStore((state) => state.getEntry);
  const updateEntry = useEntryStore((state) => state.updateEntry);
  const getResponsesForEntry = useResponseStore(
    state => state.getResponsesForEntry
  );
  
  const [entry, setEntry] = useState(getEntry(id as string));
  const [loading, setLoading] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  // Memoize responses to prevent unnecessary recalculations
  const responses = useMemo(() => {
    return getResponsesForEntry(id as string);
  }, [getResponsesForEntry, id]);

  useEffect(() => {
    if (!entry) {
      router.back();
    }
  }, [entry]);

  const isUnlockable = useCallback(() => {
    if (!entry) return false;
    const now = new Date();
    const unlockDate = new Date(entry.unlockDate);
    return now >= unlockDate;
  }, [entry?.unlockDate]);

  const handleUnlock = async () => {
    if (!isUnlockable() || !entry) return;

    setLoading(true);
    try {
      await updateEntry(entry.id, { isUnlocked: true });
      // Update local entry state after successful update
      setEntry(getEntry(entry.id));
    } catch (error) {
      setErrorToast('Failed to unlock entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const getEmotionLabel = (emotion: number) => {
    const emotions = {
      1: '😊 Happy',
      2: '😢 Sad',
      3: '😡 Angry',
      4: '😌 Calm',
      5: '😰 Anxious'
    };
    return emotions[emotion] || 'Unknown';
  };

  const getStressLabel = (level: number) => {
    const levels = {
      1: 'Very Low',
      2: 'Low',
      3: 'Moderate',
      4: 'High',
      5: 'Very High'
    };
    return levels[level] || 'Unknown';
  };

  const getStressColor = (level: number) => {
    const colors = {
      1: '#34D399',
      2: '#6EE7B7',
      3: '#FBBF24',
      4: '#F87171',
      5: '#EF4444',
    };
    return colors[level] || '#000000';
  };

  if (!entry) return null;

  return (
    <Screen>
      {loading && <LoadingOverlay message="Unlocking entry..." />}
      {errorToast && (
        <ErrorToast 
          message={errorToast} 
          onHide={() => setErrorToast('')} 
        />
      )}
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {formatDate(entry.createdAt)}
          </Text>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {entry.title || 'Untitled Entry'}
          </Text>
        </View>

        <View style={styles.moodContainer}>
          <View style={styles.moodItem}>
            <Text style={[styles.moodLabel, { color: theme.colors.textSecondary }]}>
              Mood
            </Text>
            <Text style={[styles.moodValue, { color: theme.colors.text }]}>
              {getEmotionLabel(entry.emotion)}
            </Text>
          </View>
          <View style={styles.moodItem}>
            <Text style={[styles.moodLabel, { color: theme.colors.textSecondary }]}>
              Stress Level
            </Text>
            <Text style={[styles.moodValue, { color: getStressColor(entry.stressLevel) }]}>
              {getStressLabel(entry.stressLevel)}
            </Text>
          </View>
        </View>

        {entry.isUnlocked ? (
          <View style={styles.content}>
            <Text style={[styles.message, { color: theme.colors.text }]}>
              {entry.content}
            </Text>
          </View>
        ) : (
          <View style={styles.lockedContent}>
            <Text style={[styles.lockedText, { color: theme.colors.textSecondary }]}>
              🔒 This message is locked until {formatDate(entry.unlockDate)}
            </Text>
            {isUnlockable() && (
              <Button
                title="Unlock Message"
                onPress={handleUnlock}
                style={styles.unlockButton}
              />
            )}
          </View>
        )}

        {entry.isUnlocked && (
          <>
            {entry.mediaUrls?.length > 0 && (
              <View style={styles.mediaSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Voice Messages
                </Text>
                {entry.mediaUrls.map((uri, index) => (
                  <MediaPlayer key={`${uri}-${index}`} uri={uri} />
                ))}
              </View>
            )}

            <View style={styles.responseSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Your Responses
              </Text>
              {responses.map((response) => (
                <View key={response.id} style={styles.response}>
                  <Text style={[styles.responseDate, { color: theme.colors.textSecondary }]}>
                    {formatDate(response.createdAt)}
                  </Text>
                  <Text style={[styles.responseContent, { color: theme.colors.text }]}>
                    {response.content}
                  </Text>
                  {response.mediaUrls?.map((uri, index) => (
                    <MediaPlayer key={`${uri}-${index}`} uri={uri} />
                  ))}
                </View>
              ))}
              <ResponseForm entryId={entry.id} />
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
  lockedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  lockedText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  unlockButton: {
    minWidth: 200,
  },
  responseSection: {
    marginTop: 32,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  response: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    gap: 8,
  },
  responseDate: {
    fontSize: 14,
  },
  responseContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  mediaSection: {
    marginTop: 24,
    gap: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 12,
  },
  moodItem: {
    alignItems: 'center',
    gap: 4,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  moodValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 