import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '../../components/layout/Screen';
import { useTheme } from '../../components/layout/ThemeProvider';

export default function Login() {
  const { theme } = useTheme();

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Welcome to Rewind Journal
      </Text>
      <Link href="/register" style={[styles.link, { color: theme.colors.primary }]}>
        Get Started
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  link: {
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
}); 