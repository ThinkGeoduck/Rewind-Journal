import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../layout/ThemeProvider';

interface MediaRecorderProps {
  onRecordingComplete: (uri: string) => void;
  onDelete?: () => void;
  recordedUri?: string | null;
}

export function MediaRecorder({ onRecordingComplete, onDelete, recordedUri }: MediaRecorderProps) {
  const { theme } = useTheme();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      
      if (uri) {
        onRecordingComplete(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  async function playRecording() {
    if (!recordedUri) return;

    try {
      if (sound) {
        if (isPlaying) {
          await sound.stopAsync(); // Stop the sound if it's currently playing
          setIsPlaying(false);
          return;
        }
        await sound.playAsync();
        setIsPlaying(true);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordedUri },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (!status.isPlaying) {
            setIsPlaying(false);
            // Reset sound position to allow replay
            newSound.setPositionAsync(0);
          }
        }
      });
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  }

  return (
    <View style={styles.container}>
      {!recordedUri ? (
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={[
            styles.button,
            {
              backgroundColor: isRecording ? theme.colors.primary : theme.colors.card,
            },
          ]}
        >
          <Ionicons
            name={isRecording ? 'stop' : 'mic'}
            size={24}
            color="white"
          />
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Record Audio'}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.recordingControls}>
          <Pressable
            onPress={playRecording}
            style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color="white"
            />
          </Pressable>
          <Pressable
            onPress={onDelete}
            style={[styles.controlButton, { backgroundColor: theme.colors.error }]}
          >
            <Ionicons name="trash" size={24} color="white" />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    padding: 12,
    borderRadius: 8,
  },
}); 