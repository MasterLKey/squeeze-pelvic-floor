import '../../global.css';
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { runMigrations } from '@/lib/db/client';
import {
  requestPermissions,
  setupAndroidChannel,
} from '@/features/reminders/notificationService';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await runMigrations();
        await setupAndroidChannel();
        await requestPermissions();
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    init();
  }, []);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)"        options={{ headerShown: false }} />
        <Stack.Screen name="onboarding"    options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="exercise/[id]" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
