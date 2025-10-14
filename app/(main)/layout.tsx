import { Stack } from 'expo-router';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { useTheme } from '../../components/layout/ThemeProvider';

export default function MainLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerRight: () => <ThemeToggle />,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    />
  );
} 