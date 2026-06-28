import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/useAuth';
import { getBool, setBool, getItem } from '@/lib/mmkv';
import { MMKV_KEYS } from '@/lib/constants';
import {
  scheduleReminders,
  cancelAllReminders,
} from '@/features/reminders/notificationService';

function SettingRow({
  label,
  subtitle,
  value,
  onValueChange,
}: {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <View className="flex-1 pr-4">
        <Text className="text-gray-900 font-medium text-sm">{label}</Text>
        {subtitle && <Text className="text-gray-400 text-xs mt-0.5">{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
        thumbColor="#fff"
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const [hapticsEnabled, setHapticsEnabledState] = useState(getBool(MMKV_KEYS.HAPTICS_ENABLED, true));
  const [remindersEnabled, setRemindersEnabledState] = useState(getBool(MMKV_KEYS.REMINDERS_ENABLED, true));
  const [audioCuesEnabled, setAudioCuesEnabledState] = useState(getBool(MMKV_KEYS.AUDIO_CUES_ENABLED, false));

  function toggleHaptics(v: boolean) {
    setBool(MMKV_KEYS.HAPTICS_ENABLED, v);
    setHapticsEnabledState(v);
  }

  async function toggleReminders(v: boolean) {
    setBool(MMKV_KEYS.REMINDERS_ENABLED, v);
    setRemindersEnabledState(v);
    if (v) {
      const times = getItem<{ hour: number; minute: number; enabled: boolean; id: string; label: string | null }[]>(MMKV_KEYS.REMINDER_TIMES) ?? [
        { id: '1', hour: 9,  minute: 0, enabled: true, label: 'Morning' },
        { id: '2', hour: 20, minute: 0, enabled: true, label: 'Evening' },
      ];
      await scheduleReminders(times.map((t) => ({ ...t, label: t.label ?? null })));
    } else {
      await cancelAllReminders();
    }
  }

  function toggleAudio(v: boolean) {
    setBool(MMKV_KEYS.AUDIO_CUES_ENABLED, v);
    setAudioCuesEnabledState(v);
  }

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-squeeze-bg">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <Text className="text-2xl font-bold text-gray-900 mt-6 mb-6">Settings</Text>

        {/* Account */}
        <Text className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-2">Account</Text>
        <Card className="mb-4">
          {user ? (
            <View>
              <Text className="text-gray-900 font-medium text-sm mb-0.5">Signed in as</Text>
              <Text className="text-primary-600 text-sm mb-4">{user.email}</Text>
              <Button title="Sign Out" variant="ghost" size="sm" onPress={handleSignOut} />
            </View>
          ) : (
            <View>
              <Text className="text-gray-900 font-medium text-sm mb-1">Not signed in</Text>
              <Text className="text-gray-400 text-xs mb-4">
                Create an account to sync your history across devices and never lose your progress.
              </Text>
              <Button title="Sign In / Create Account" variant="primary" size="sm" onPress={() => {}} className="w-full" />
            </View>
          )}
        </Card>

        {/* Exercise */}
        <Text className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-2">Exercise</Text>
        <Card className="mb-4">
          <SettingRow
            label="Haptic Feedback"
            subtitle="Vibrate on squeeze/rest transitions"
            value={hapticsEnabled}
            onValueChange={toggleHaptics}
          />
          <SettingRow
            label="Audio Cues"
            subtitle="Play a tone on transitions"
            value={audioCuesEnabled}
            onValueChange={toggleAudio}
          />
        </Card>

        {/* Reminders */}
        <Text className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-2">Reminders</Text>
        <Card className="mb-4">
          <SettingRow
            label="Daily Reminders"
            subtitle="Get notified to do your exercises"
            value={remindersEnabled}
            onValueChange={toggleReminders}
          />
          {remindersEnabled && (
            <View className="pt-3 mt-1 border-t border-gray-50">
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-600 text-sm">Morning reminder</Text>
                <Text className="text-primary-600 font-semibold text-sm">9:00 AM</Text>
              </View>
              <View className="flex-row items-center justify-between py-2">
                <Text className="text-gray-600 text-sm">Evening reminder</Text>
                <Text className="text-primary-600 font-semibold text-sm">8:00 PM</Text>
              </View>
              <Text className="text-gray-400 text-xs mt-2">
                Smart: if you've already completed a session, remaining reminders for that day are suppressed.
              </Text>
            </View>
          )}
        </Card>

        {/* About */}
        <Text className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-2">About</Text>
        <Card className="mb-4">
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-gray-600 text-sm">Version</Text>
            <Text className="text-gray-400 text-sm">1.0.0</Text>
          </View>
          <View className="flex-row items-center justify-between py-2 border-t border-gray-50">
            <Text className="text-gray-600 text-sm">Data & Privacy</Text>
            <Text className="text-primary-600 text-sm">→</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
