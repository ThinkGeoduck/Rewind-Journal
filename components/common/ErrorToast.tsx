import { useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useTheme } from '../layout/ThemeProvider';

interface ErrorToastProps {
  message: string;
  onHide: () => void;
}

export function ErrorToast({ message, onHide }: ErrorToastProps) {
  const { theme } = useTheme();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  }, [message]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { backgroundColor: theme.colors.primary },
        { opacity },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
}); 