import { View, StyleSheet, SafeAreaView, ViewProps } from 'react-native';
import { useTheme } from './ThemeProvider';

interface ScreenProps extends ViewProps {
  padded?: boolean;
}

export function Screen({ children, style, padded = true, ...props }: ScreenProps) {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.safe,
        {
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.container,
          padded && styles.padded,
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  padded: {
    padding: 16,
  },
}); 