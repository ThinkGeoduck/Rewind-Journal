import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../layout/ThemeProvider';
import { APP_CONSTANTS } from '../../lib/constants';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export function Logo({ size = 'medium' }: LogoProps) {
  const { theme } = useTheme();
  
  const fontSize = {
    small: 20,
    medium: 24,
    large: 32,
  }[size];

  return (
    <View style={styles.container}>
      <Text style={[
        styles.text,
        { color: theme.colors.primary, fontSize }
      ]}>
        {APP_CONSTANTS.APP_NAME}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
}); 