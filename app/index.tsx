import { View, Text, StyleSheet, Animated } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Screen } from '../components/layout/Screen';
import { useTheme } from '../components/layout/ThemeProvider';
import { APP_CONSTANTS } from '../lib/constants';

export default function Welcome() {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Screen>
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {APP_CONSTANTS.APP_NAME}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Write. Wait. Reflect.
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Write messages to your future self and reflect on your journey.
        </Text>
        <Link 
          href="/register" 
          style={[
            styles.link,
            { 
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary,
            }
          ]}
        >
          <Text style={styles.linkText}>Get Started</Text>
        </Link>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  link: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
}); 