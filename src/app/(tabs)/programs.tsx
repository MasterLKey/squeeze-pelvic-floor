import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { PROGRAMS } from '@/features/exercise/programs';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { setItem, getItem } from '@/lib/mmkv';
import { MMKV_KEYS } from '@/lib/constants';

const DIFFICULTY_CONFIG = {
  beginner:     { label: 'Beginner',     color: 'text-green-600',  bg: 'bg-green-50' },
  intermediate: { label: 'Intermediate', color: 'text-orange-500', bg: 'bg-orange-50' },
  advanced:     { label: 'Advanced',     color: 'text-red-500',    bg: 'bg-red-50' },
};

export default function ProgramsScreen() {
  const activeProgramId = getItem<string>(MMKV_KEYS.ACTIVE_PROGRAM_ID);

  function selectProgram(programId: string, isPremium: boolean) {
    if (isPremium) {
      Alert.alert(
        'Premium Program',
        'Unlock all programs with Squeeze Premium — a one-time purchase, no subscription required.',
        [{ text: 'OK' }],
      );
      return;
    }
    setItem(MMKV_KEYS.ACTIVE_PROGRAM_ID, programId);
    setItem(MMKV_KEYS.CURRENT_WEEK, 1);
    setItem(MMKV_KEYS.CURRENT_DAY, 1);
    Alert.alert('Program Started! 🎯', 'Your program is now active. Head to Today to begin.', [{ text: 'Let\'s go!' }]);
  }

  return (
    <SafeAreaView className="flex-1 bg-squeeze-bg">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
      >
        <Text className="text-2xl font-bold text-gray-900 mt-6 mb-2">Programs</Text>
        <Text className="text-gray-400 text-sm mb-6">
          8-week structured plans designed around clinical guidelines. Foundation is free.
        </Text>

        {PROGRAMS.map((program) => {
          const diff   = DIFFICULTY_CONFIG[program.difficulty];
          const active = activeProgramId === program.id;

          return (
            <Card key={program.id} className={`mb-4 ${active ? 'border-2 border-primary-400' : ''}`}>
              {active && (
                <View className="bg-primary-50 rounded-xl px-3 py-1.5 mb-3 self-start">
                  <Text className="text-primary-600 text-xs font-bold">▶ Active Program</Text>
                </View>
              )}

              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 pr-2">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-gray-900 font-bold text-lg">{program.name}</Text>
                    {program.isPremium && (
                      <View className="bg-yellow-50 rounded-lg px-2 py-0.5">
                        <Text className="text-yellow-600 text-xs font-bold">PRO</Text>
                      </View>
                    )}
                  </View>
                  <View className={`self-start ${diff.bg} rounded-xl px-2.5 py-0.5 mb-2`}>
                    <Text className={`${diff.color} text-xs font-semibold`}>{diff.label}</Text>
                  </View>
                  <Text className="text-gray-500 text-sm leading-relaxed">{program.description}</Text>
                </View>
              </View>

              <View className="flex-row gap-4 mt-3 pt-3 border-t border-gray-50 mb-4">
                <View>
                  <Text className="text-gray-900 font-bold text-base">{program.weeks.length}</Text>
                  <Text className="text-gray-400 text-xs">Weeks</Text>
                </View>
                <View>
                  <Text className="text-gray-900 font-bold text-base">
                    {program.weeks[0]?.days[0]?.sets ?? 2}–{program.weeks[program.weeks.length - 1]?.days[0]?.sets ?? 5}
                  </Text>
                  <Text className="text-gray-400 text-xs">Sets</Text>
                </View>
                <View>
                  <Text className="text-gray-900 font-bold text-base">5 days/wk</Text>
                  <Text className="text-gray-400 text-xs">Frequency</Text>
                </View>
              </View>

              <Button
                title={active ? 'Currently Active' : program.isPremium ? 'Unlock — Premium' : 'Start This Program'}
                variant={active ? 'secondary' : program.isPremium ? 'ghost' : 'primary'}
                onPress={() => !active && selectProgram(program.id, program.isPremium)}
                disabled={active}
                className="w-full"
              />
            </Card>
          );
        })}

        {/* Physio mode */}
        <Card className="mt-2">
          <Text className="text-gray-900 font-semibold text-base mb-1">Physio Mode</Text>
          <Text className="text-gray-400 text-sm mb-4">
            Working with a pelvic health physiotherapist? Set custom parameters — no limits on reps or hold time.
          </Text>
          <Button title="Configure Custom Session" variant="secondary" className="w-full" onPress={() => {}} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
