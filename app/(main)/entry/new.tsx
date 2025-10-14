import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Platform, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../../../components/layout/Screen';
import { useTheme } from '../../../components/layout/ThemeProvider';
import { useEntryStore } from '../../../stores/entry.store';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LoadingOverlay } from '../../../components/common/LoadingOverlay';
import { ErrorToast } from '../../../components/common/ErrorToast';
import { MediaRecorder } from '../../../components/entry/MediaRecorder';

interface NewEntry {
  title: string;
  content: string;
  unlockDate: Date;
  mediaUrls: string[];
  isUnlocked: boolean;
  emotion: number;
  stressLevel: number;
}

const EMOTIONS = [
  { id: 1, label: 'Happy', icon: '😊' },
  { id: 2, label: 'Sad', icon: '😢' },
  { id: 3, label: 'Angry', icon: '😠' },
  { id: 4, label: 'Excited', icon: '🎉' },
  { id: 5, label: 'Anxious', icon: '😰' },
  { id: 6, label: 'Peaceful', icon: '😌' },
];

export default function NewEntry() {
  const { theme } = useTheme();
  const addEntry = useEntryStore((state) => state.addEntry);
  const contentInputRef = useRef<TextInput>(null);
  
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState(3);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorToast, setErrorToast] = useState('');
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || unlockDate;
    
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 1);
    
    if (currentDate < minDate) {
      setErrorToast('Please select a future date (at least 1 hour from now)');
      setUnlockDate(minDate);
    } else {
      setUnlockDate(currentDate);
    }

    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStressLevelColor = (level: number, currentLevel: number) => {
    if (level > currentLevel) return theme.colors.card;
    
    // Color progression from green to yellow to red
    const colors = {
      1: '#34D399', // green
      2: '#6EE7B7', // light green
      3: '#FBBF24', // yellow
      4: '#F87171', // light red
      5: '#EF4444', // red
    } as const;
    
    return colors[level as keyof typeof colors];
  };

  const handleRecordingComplete = (uri: string) => {
    setRecordedUri(uri);
  };

  const handleDeleteRecording = () => {
    setRecordedUri(null);
  };

  const handleSave = async () => {
    console.log('Save button pressed');
    
    // Validate inputs
    if (!selectedEmotion) {
      setErrorToast('Please select how you are feeling');
      return;
    }

    if (!content.trim()) {
      setErrorToast('Please write something in your entry');
      return;
    }

    // Show loading state
    setLoading(true);

    try {
      const entryData = {
        title: title.trim() || getDefaultTitle(),
        content: content.trim(),
        unlockDate,
        mediaUrls: recordedUri ? [recordedUri] : [],
        isUnlocked: false,
        emotion: selectedEmotion,
        stressLevel,
      };

      console.log('Attempting to save entry:', entryData);
      
      const success = await addEntry(entryData);
      
      if (success) {
        console.log('Entry saved successfully');
        router.replace('/(main)/dashboard');
      } else {
        throw new Error('Failed to save entry');
      }
    } catch (error) {
      console.error('Save entry error:', error);
      setErrorToast('Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTitle = () => {
    const emotion = EMOTIONS.find(e => e.id === selectedEmotion);
    return emotion ? `Feeling ${emotion.label}` : 'New Entry';
  };

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const renderStressLevel = () => {
    return (
      <View style={styles.stressContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Stress Level</Text>
        <View style={styles.stressLevelContainer}>
          {[1, 2, 3, 4, 5].map((level) => (
            <Pressable
              key={level}
              onPress={() => setStressLevel(level)}
              style={[
                styles.stressLevel,
                {
                  backgroundColor: getStressLevelColor(level, stressLevel),
                  borderColor: theme.colors.border,
                }
              ]}
            >
              <View style={styles.stressLevelIndicator} />
            </Pressable>
          ))}
        </View>
        <Text style={[styles.stressLevelLabel, { color: theme.colors.textSecondary }]}>
          {stressLevel === 1 ? 'Very Low' :
           stressLevel === 2 ? 'Low' :
           stressLevel === 3 ? 'Moderate' :
           stressLevel === 4 ? 'High' : 'Very High'}
        </Text>
      </View>
    );
  };

  return (
    <Screen>
      {loading && <LoadingOverlay message="Saving your entry..." />}
      {errorToast && (
        <ErrorToast 
          message={errorToast} 
          onHide={() => setErrorToast('')} 
        />
      )}
      
      <ScrollView 
        style={[
          styles.container,
          isWriting && { backgroundColor: theme.colors.background }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable 
            onPress={() => {
              if (isWriting) {
                setIsWriting(false);
                Keyboard.dismiss();
              } else {
                router.back();
              }
            }} 
            style={styles.backButton}
          >
            <Ionicons 
              name={isWriting ? "chevron-down" : "chevron-back"} 
              size={24} 
              color={theme.colors.text} 
            />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {isWriting ? 'Edit Journal' : 'New Journal'}
          </Text>
          {!isWriting && (
            <Pressable 
              onPress={handleSave}
              disabled={loading}
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: loading ? theme.colors.border : theme.colors.primary,
                  opacity: loading ? 0.7 : 1
                }
              ]}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          )}
          {isWriting && (
            <Pressable 
              onPress={() => {
                setIsWriting(false);
                Keyboard.dismiss();
              }}
              style={[
                styles.doneButton, 
                { backgroundColor: theme.colors.primary }
              ]}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          )}
        </View>

        <View style={[
          styles.inputContainer,
          isWriting && styles.writingContainer
        ]}>
          {!isWriting ? (
            <>
              <View style={styles.emotionsContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>How are you feeling?</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.emotionsScroll}
                >
                  {EMOTIONS.map((emotion) => (
                    <Pressable
                      key={emotion.id}
                      onPress={() => setSelectedEmotion(emotion.id)}
                      style={[
                        styles.emotionButton,
                        {
                          backgroundColor: selectedEmotion === emotion.id 
                            ? theme.colors.primary 
                            : theme.colors.card,
                          borderColor: theme.colors.border,
                        }
                      ]}
                    >
                      <Text style={styles.emotionIcon}>{emotion.icon}</Text>
                      <Text 
                        style={[
                          styles.emotionLabel,
                          { 
                            color: selectedEmotion === emotion.id 
                              ? 'white' 
                              : theme.colors.text 
                          }
                        ]}
                      >
                        {emotion.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {renderStressLevel()}

              <Pressable
                onPress={() => setIsWriting(true)}
                style={[
                  styles.contentPreview,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  }
                ]}
              >
                {content ? (
                  <Text 
                    style={[styles.contentText, { color: theme.colors.text }]}
                    numberOfLines={3}
                  >
                    {content}
                  </Text>
                ) : (
                  <Text style={[styles.placeholder, { color: theme.colors.textSecondary }]}>
                    Write your entry here...
                  </Text>
                )}
              </Pressable>

              <View style={styles.unlockDateContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  When should this unlock?
                </Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    styles.dateButton,
                    {
                      backgroundColor: theme.colors.card,
                      borderColor: theme.colors.border,
                    }
                  ]}
                >
                  <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>
                    {formatDate(unlockDate)}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
                </Pressable>
              </View>

              {(showDatePicker || Platform.OS === 'ios') && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={unlockDate}
                  mode="datetime"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  textColor={theme.colors.text}
                  style={Platform.OS === 'ios' ? styles.iosDatePicker : undefined}
                />
              )}

              <View style={styles.mediaSection}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Voice Message</Text>
                <MediaRecorder
                  onRecordingComplete={handleRecordingComplete}
                  onDelete={handleDeleteRecording}
                  recordedUri={recordedUri}
                />
              </View>
            </>
          ) : (
            <View style={styles.writingView}>
              <TextInput
                ref={contentInputRef}
                value={title}
                onChangeText={setTitle}
                placeholder="Entry Title"
                placeholderTextColor={theme.colors.textSecondary}
                style={[styles.writingTitle, { color: theme.colors.text }]}
              />
              {selectedEmotion && (
                <Text style={styles.selectedEmoji}>
                  {EMOTIONS.find(e => e.id === selectedEmotion)?.icon}
                </Text>
              )}
              <TextInput
                ref={contentInputRef}
                value={content}
                onChangeText={setContent}
                multiline
                style={[
                  styles.contentInput,
                  { color: theme.colors.text }
                ]}
                placeholder="Write your entry..."
                placeholderTextColor={theme.colors.textSecondary}
                autoFocus
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    padding: 16,
    gap: 20,
  },
  writingContainer: {
    flex: 1,
    padding: 20,
  },
  emotionsContainer: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emotionsScroll: {
    flexGrow: 0,
  },
  emotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  emotionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  emotionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentPreview: {
    minHeight: 100,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
  },
  writingView: {
    flex: 1,
    gap: 16,
  },
  writingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 0,
  },
  selectedEmoji: {
    fontSize: 24,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    padding: 0,
  },
  placeholder: {
    fontSize: 16,
  },
  stressContainer: {
    gap: 8,
  },
  stressLevelContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stressLevel: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  stressLevelIndicator: {
    flex: 1,
    borderRadius: 6,
  },
  stressLevelLabel: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  unlockDateContainer: {
    gap: 8,
  },
  mediaSection: {
    gap: 12,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  dateButtonText: {
    fontSize: 16,
  },
  iosDatePicker: {
    alignSelf: 'stretch',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  contentText: {
    fontSize: 16,
  },
}); 