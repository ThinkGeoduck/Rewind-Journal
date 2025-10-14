import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../layout/ThemeProvider';

interface LoadingProps {
  message?: string;
}

export function Loading({ message }: LoadingProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
}); 