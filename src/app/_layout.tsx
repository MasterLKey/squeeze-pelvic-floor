import '../../global.css';
import React, { useEffect } from 'react';
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
  useEffect(() => {
    async function init() {
      await runMigrations();
      await setupAndroidChannel();
      await requestPermissions();
      await SplashScreen.hideAsync();
    }
    init();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)"       options={{ headerShown: false }} />
        <Stack.Screen name="onboarding"   options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="exercise/[id]" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
