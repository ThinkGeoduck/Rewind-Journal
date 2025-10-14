import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../components/layout/ThemeProvider';
import { useEntryStore } from '../stores/entry.store';
import { useResponseStore } from '../stores/response.store';
import { NotificationService } from '../services/notifications';
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
  const initializeEntries = useEntryStore((state) => state.initializeEntries);
  const initializeResponses = useResponseStore(state => state.initializeStore);

  useEffect(() => {
    async function initialize() {
      // Setup notifications first
      await NotificationService.setupNotifications();
      
      // Then initialize stores
      await initializeEntries();
      await initializeResponses();
    }

    initialize();
  }, [initializeEntries, initializeResponses]);

  useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get notification permissions');
        return;
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </ThemeProvider>
  );
} 