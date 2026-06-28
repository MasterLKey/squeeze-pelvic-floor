import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NOTIFICATION_CHANNELS } from '@/lib/constants';
import type { ReminderTime } from '@/lib/db/schema';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:   true,
    shouldPlaySound:   false,
    shouldSetBadge:    true,
    shouldShowBanner:  true,
    shouldShowList:    true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert:  true,
      allowBadge:  true,
      allowSound:  false,
    },
  });
  return status === 'granted';
}

export async function setupAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.REMINDERS, {
    name:              'Daily Reminders',
    importance:        Notifications.AndroidImportance.HIGH,
    vibrationPattern:  [0, 250, 250, 250],
    enableVibrate:     true,
    showBadge:         true,
  });
}

export async function scheduleReminders(reminders: ReminderTime[]): Promise<void> {
  await cancelAllReminders();
  const active = reminders.filter((r) => r.enabled);
  for (const reminder of active) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to squeeze! 💪',
        body:  "Your pelvic floor is waiting — it only takes a few minutes.",
        data:  { type: 'reminder' },
        ...(Platform.OS === 'android' && { channelId: NOTIFICATION_CHANNELS.REMINDERS }),
      },
      trigger: {
        type:      Notifications.SchedulableTriggerInputTypes.DAILY,
        hour:      reminder.hour,
        minute:    reminder.minute,
        repeats:   true,
      },
    });
  }
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function sendSessionCompleteBadgeClear(): Promise<void> {
  await Notifications.setBadgeCountAsync(0);
}

export async function getScheduledReminders(): Promise<Notifications.NotificationRequest[]> {
  return Notifications.getAllScheduledNotificationsAsync();
}
