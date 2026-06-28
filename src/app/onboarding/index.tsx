import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { setItem, setBool } from '@/lib/mmkv';
import { MMKV_KEYS } from '@/lib/constants';
import {
  requestPermissions,
  scheduleReminders,
} from '@/features/reminders/notificationService';

const GOALS = [
  { id: 'general',     emoji: '💪', label: 'General strength',       desc: 'Improve overall pelvic floor fitness' },
  { id: 'postpartum',  emoji: '👶', label: 'Postpartum recovery',    desc: 'Rebuild strength after childbirth' },
  { id: 'incontinence',emoji: '💧', label: 'Bladder control',        desc: 'Reduce leaks and urgency' },
  { id: 'physio',      emoji: '🏥', label: 'Physiotherapy program',  desc: 'Following a prescribed plan' },
  { id: 'preventive',  emoji: '🌟', label: 'Prevention',             desc: 'Stay strong before issues arise' },
] as const;

type Goal = typeof GOALS[number]['id'];

const DEFAULT_REMINDERS = [
  { id: '1', hour: 9,  minute: 0, enabled: true, label: 'Morning' },
  { id: '2', hour: 20, minute: 0, enabled: true, label: 'Evening' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState<'welcome' | 'goal' | 'reminders' | 'done'>('welcome');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [enableReminders, setEnableReminders] = useState(true);

  async function finish() {
    setItem(MMKV_KEYS.USER_GOAL, selectedGoal ?? 'general');
    setBool(MMKV_KEYS.ONBOARDING_COMPLETE, true);
    setBool(MMKV_KEYS.REMINDERS_ENABLED, enableReminders);
    setBool(MMKV_KEYS.HAPTICS_ENABLED, true);

    if (enableReminders) {
      const granted = await requestPermissions();
      if (granted) {
        setItem(MMKV_KEYS.REMINDER_TIMES, DEFAULT_REMINDERS);
        await scheduleReminders(DEFAULT_REMINDERS);
      }
    }

    router.replace('/(tabs)');
  }

  if (step === 'welcome') {
    return (
      <SafeAreaView className="flex-1 bg-primary-600 items-center justify-center px-8">
        <Text className="text-7xl mb-6">💪</Text>
        <Text className="text-white text-3xl font-bold text-center mb-3">Squeeze</Text>
        <Text className="text-primary-200 text-base text-center mb-12 leading-relaxed">
          Your pelvic floor exercise companion. Clinically informed. Privacy first. No dark patterns.
        </Text>
        <Button
          title="Get started"
          variant="secondary"
          size="lg"
          className="w-full"
          onPress={() => setStep('goal')}
        />
        <TouchableOpacity className="mt-4 py-2" onPress={() => router.replace('/(tabs)')}>
          <Text className="text-primary-200 text-sm">Skip setup</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (step === 'goal') {
    return (
      <SafeAreaView className="flex-1 bg-squeeze-bg">
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
          <Text className="text-2xl font-bold text-gray-900 mt-8 mb-2">What's your goal?</Text>
          <Text className="text-gray-400 text-sm mb-6">
            This helps us recommend the right program. You can change it any time.
          </Text>

          <View className="gap-3 mb-8">
            {GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                className={`flex-row items-center p-4 rounded-2xl border-2 bg-white ${
                  selectedGoal === goal.id ? 'border-primary-500' : 'border-transparent'
                }`}
                style={{ shadowColor: '#8B5CF6', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}
                onPress={() => setSelectedGoal(goal.id)}
              >
                <Text className="text-2xl mr-4">{goal.emoji}</Text>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">{goal.label}</Text>
                  <Text className="text-gray-400 text-sm">{goal.desc}</Text>
                </View>
                {selectedGoal === goal.id && (
                  <Text className="text-primary-500 text-lg ml-2">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Continue"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!selectedGoal}
            onPress={() => setStep('reminders')}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'reminders') {
    return (
      <SafeAreaView className="flex-1 bg-squeeze-bg items-center justify-center px-8">
        <Text className="text-5xl mb-6">🔔</Text>
        <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">Set reminders?</Text>
        <Text className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
          We'll remind you at 9 AM and 8 PM. Reminders are automatically suppressed on days you've already exercised.
        </Text>

        <View className="w-full gap-3 mb-8">
          <TouchableOpacity
            className={`p-4 rounded-2xl border-2 bg-white ${enableReminders ? 'border-primary-500' : 'border-transparent'}`}
            style={{ shadowColor: '#8B5CF6', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}
            onPress={() => setEnableReminders(true)}
          >
            <Text className="text-gray-900 font-semibold text-base">Yes, remind me</Text>
            <Text className="text-gray-400 text-sm">9:00 AM and 8:00 PM daily</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-4 rounded-2xl border-2 bg-white ${!enableReminders ? 'border-primary-500' : 'border-transparent'}`}
            style={{ shadowColor: '#8B5CF6', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}
            onPress={() => setEnableReminders(false)}
          >
            <Text className="text-gray-900 font-semibold text-base">No thanks</Text>
            <Text className="text-gray-400 text-sm">I'll remember on my own</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Finish setup"
          variant="primary"
          size="lg"
          className="w-full"
          onPress={finish}
        />
      </SafeAreaView>
    );
  }

  return null;
}
