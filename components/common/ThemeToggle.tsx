import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../layout/ThemeProvider';

export function ThemeToggle() {
  const { mode, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.button}>
      <Ionicons
        name={mode === 'dark' ? 'sunny' : 'moon'}
        size={24}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
}); 