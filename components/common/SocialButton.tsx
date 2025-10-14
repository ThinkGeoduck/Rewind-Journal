import { TouchableOpacity, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { useTheme } from '../layout/ThemeProvider';

interface SocialButtonProps {
  onPress: () => void;
  icon: any;
  title: string;
  style?: ViewStyle;
}

export function SocialButton({ onPress, icon, title, style }: SocialButtonProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Image source={icon} style={styles.icon} />
      <Text style={[styles.text, { color: theme.colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 