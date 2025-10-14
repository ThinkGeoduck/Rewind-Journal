import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../layout/ThemeProvider';

interface MediaPlayerProps {
  uri: string;
}

export function MediaPlayer({ uri }: MediaPlayerProps) {
  const { theme } = useTheme();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const isMounted = useRef(true);
  
  // Use refs to track current values without causing re-renders
  const currentPositionRef = useRef(position);
  const currentDurationRef = useRef(duration);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    currentPositionRef.current = position;
    currentDurationRef.current = duration;
    isPlayingRef.current = isPlaying;
  }, [position, duration, isPlaying]);

  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (!isMounted.current || !status.isLoaded) return;

    const newDuration = status.durationMillis || 0;
    const newPosition = status.positionMillis || 0;
    const newIsPlaying = status.isPlaying;

    // Only update state if values have changed significantly
    if (Math.abs(newDuration - currentDurationRef.current) > 100) {
      setDuration(newDuration);
    }
    
    if (Math.abs(newPosition - currentPositionRef.current) > 100) {
      setPosition(newPosition);
    }

    if (newIsPlaying !== isPlayingRef.current) {
      setIsPlaying(newIsPlaying);
    }
  }, []); // Remove dependencies to prevent infinite updates

  useEffect(() => {
    const setupAudio = async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );

        if (!isMounted.current) {
          await newSound.unloadAsync();
          return;
        }

        soundRef.current = newSound;
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };

    setupAudio();

    return () => {
      const cleanup = async () => {
        if (soundRef.current) {
          try {
            await soundRef.current.unloadAsync();
            soundRef.current = null;
          } catch (error) {
            console.error('Error cleaning up sound:', error);
          }
        }
      };
      cleanup();
    };
  }, [uri, onPlaybackStatusUpdate]);

  const handlePlayPause = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      if (isPlayingRef.current) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Error playing/pausing sound:', error);
    }
  }, []);

  const formatTime = useCallback((millis: number) => {
    const seconds = Math.floor(millis / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <Pressable
        onPress={handlePlayPause}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.colors.primary },
          pressed && { opacity: 0.8 }
        ]}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={24}
          color="white"
        />
      </Pressable>
      <View style={styles.info}>
        <Text style={[styles.time, { color: theme.colors.text }]}>
          {formatTime(position)} / {formatTime(duration)}
        </Text>
        <View 
          style={[styles.progress, { backgroundColor: theme.colors.border }]}
        >
          <View 
            style={[
              styles.progressFill,
              { 
                backgroundColor: theme.colors.primary,
                width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
              },
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    marginBottom: 4,
  },
  progress: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
}); 