import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../layout/ThemeProvider';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
  },
}); 