import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { MediaRecorder } from './MediaRecorder';
import { useTheme } from '../layout/ThemeProvider';
import { useResponseStore } from '../../stores/response.store';

interface ResponseFormProps {
  entryId: string;
  onComplete?: () => void;
}

export function ResponseForm({ entryId, onComplete }: ResponseFormProps) {
  const { theme } = useTheme();
  const addResponse = useResponseStore((state) => state.addResponse);
  const [content, setContent] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleMediaRecorded = (uri: string) => {
    setMediaUrls([...mediaUrls, uri]);
  };

  const handleSubmit = async () => {
    if (!content && mediaUrls.length === 0) {
      setError('Please add a text response or voice message');
      return;
    }

    try {
      await addResponse({
        entryId,
        content,
        mediaUrls,
      });
      
      setContent('');
      setMediaUrls([]);
      setError('');
      onComplete?.();
    } catch (err) {
      setError('Failed to save response. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Write your response..."
        multiline
        numberOfLines={4}
        value={content}
        onChangeText={setContent}
        error={error}
        style={styles.input}
      />
      <MediaRecorder onRecordingComplete={handleMediaRecorded} />
      <Button 
        title="Submit Response" 
        onPress={handleSubmit}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  input: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 8,
  },
}); 