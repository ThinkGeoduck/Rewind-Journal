import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../layout/ThemeProvider';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
}

export function Button({ onPress, title, variant = 'primary' }: ButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.colors.primary },
        variant === 'secondary' && {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          { color: variant === 'secondary' ? theme.colors.primary : '#fff' },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 