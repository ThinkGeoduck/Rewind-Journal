import { Stack } from 'expo-router';
import { useTheme } from '../../components/layout/ThemeProvider';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export default function MainLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
        headerRight: () => <ThemeToggle />,
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Rewind Journal',
        }}
      />
      <Stack.Screen
        name="entry/new"
        options={{
          title: 'New Entry',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="entry/[id]"
        options={{
          title: 'Entry',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Stack>
  );
} 