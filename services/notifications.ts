import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Entry } from '../types/entry.types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  static async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async scheduleUnlockNotification(entry: Entry) {
    const unlockDate = new Date(entry.unlockDate);
    const now = new Date();

    // Don't schedule if the unlock date is in the past
    if (unlockDate <= now) return;

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "A message from your past self is ready! 🎉",
          body: entry.title 
            ? `Your entry "${entry.title}" can now be unlocked!`
            : "A time capsule from your past is ready to be opened!",
          data: { entryId: entry.id },
        },
        trigger: {
          date: unlockDate,
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  static async cancelNotification(identifier: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  static async setupNotifications() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    await this.requestPermissions();
  }
} 