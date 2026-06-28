import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { SessionCard } from '@/components/ui/SessionCard';
import {
  getRecentSessions,
  getStreakData,
  getTodaySessions,
  getWeeklyStats,
} from '@/features/exercise/sessionRepository';
import { getProgramById } from '@/features/exercise/programs';
import { getItem } from '@/lib/mmkv';
import { MMKV_KEYS, DEFAULT_EXERCISE_PARAMS, EXERCISE_TYPES } from '@/lib/constants';
import type { Session } from '@/lib/db/schema';

interface WeeklyStat { date: string; totalSeconds: number }

function WeeklyChart({ stats }: { stats: WeeklyStat[] }) {
  const max = Math.max(...stats.map((s) => s.totalSeconds), 1);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const today = new Date();
  const last7: string[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <View className="flex-row items-end justify-between px-1 mt-2" style={{ height: 60 }}>
      {last7.map((date, i) => {
        const stat = stats.find((s) => s.date === date);
        const height = stat ? Math.max((stat.totalSeconds / max) * 52, 4) : 4;
        const dayName = days[new Date(date + 'T12:00:00').getDay() === 0 ? 6 : new Date(date + 'T12:00:00').getDay() - 1];
        return (
          <View key={date} className="items-center gap-1" style={{ width: '13%' }}>
            <View
              className={stat ? 'bg-primary-500 rounded-t-lg' : 'bg-gray-100 rounded-t-lg'}
              style={{ width: '70%', height }}
            />
            <Text className="text-gray-400 text-xs">{dayName}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [todaySessions, setTodaySessions] = useState<Session[]>([]);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const activeProgramId = getItem<string>(MMKV_KEYS.ACTIVE_PROGRAM_ID);
  const activeProgram = activeProgramId ? getProgramById(activeProgramId) : null;
  const currentWeek = getItem<number>(MMKV_KEYS.CURRENT_WEEK) ?? 1;
  const currentDay  = getItem<number>(MMKV_KEYS.CURRENT_DAY) ?? 1;

  const load = useCallback(async () => {
    const [{ streak: s }, today, recent, weekly] = await Promise.all([
      getStreakData(),
      getTodaySessions(),
      getRecentSessions(5),
      getWeeklyStats(),
    ]);
    setStreak(s);
    setTodaySessions(today);
    setRecentSessions(recent);
    setWeeklyStats(weekly);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const todayDone = todaySessions.length > 0;

  const startSession = () => {
    let params: Record<string, string> = {
      exerciseType: EXERCISE_TYPES.MIXED,
      holdDuration: String(DEFAULT_EXERCISE_PARAMS.holdDuration),
      restDuration: String(DEFAULT_EXERCISE_PARAMS.restDuration),
      reps:         String(DEFAULT_EXERCISE_PARAMS.reps),
      sets:         String(DEFAULT_EXERCISE_PARAMS.sets),
    };

    if (activeProgram) {
      const day = activeProgram.weeks
        .find((w) => w.week === currentWeek)
        ?.days.find((d) => d.day === currentDay);
      if (day) {
        params = {
          exerciseType: day.exerciseType,
          holdDuration: String(day.holdDuration),
          restDuration: String(day.restDuration),
          reps:         String(day.reps),
          sets:         String(day.sets),
          programId:    activeProgramId ?? '',
          week:         String(currentWeek),
          day:          String(currentDay),
        };
      }
    }

    router.push({ pathname: '/exercise/[id]', params: { id: 'new', ...params } });
  };

  return (
    <SafeAreaView className="flex-1 bg-squeeze-bg">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mt-6 mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Good day! 👋</Text>
            <Text className="text-gray-400 text-sm mt-1">
              {todayDone ? "Great work today — you're done!" : "Time for your pelvic floor workout."}
            </Text>
          </View>
          <StreakBadge streak={streak} />
        </View>

        {/* Today's goal card */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 font-semibold text-base">
              {activeProgram ? `${activeProgram.name} · Week ${currentWeek}, Day ${currentDay}` : "Quick Session"}
            </Text>
            {todayDone && (
              <View className="bg-green-50 rounded-xl px-2.5 py-1">
                <Text className="text-green-600 text-xs font-bold">✓ Done</Text>
              </View>
            )}
          </View>

          <Button
            title={todayDone ? 'Do Another Session' : 'Start Session'}
            variant={todayDone ? 'secondary' : 'primary'}
            size="lg"
            onPress={startSession}
            className="w-full"
          />
        </Card>

        {/* Weekly chart */}
        <Card className="mb-4">
          <Text className="text-gray-900 font-semibold text-base mb-1">This Week</Text>
          <Text className="text-gray-400 text-xs mb-2">Total squeeze time per day</Text>
          <WeeklyChart stats={weeklyStats} />
        </Card>

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <View>
            <Text className="text-gray-900 font-semibold text-base mb-3">Recent Sessions</Text>
            {recentSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </View>
        )}

        {recentSessions.length === 0 && (
          <Card className="items-center py-8">
            <Text className="text-4xl mb-3">💪</Text>
            <Text className="text-gray-900 font-semibold text-base mb-1">Ready to start?</Text>
            <Text className="text-gray-400 text-sm text-center">
              Your first session will appear here. It only takes a few minutes!
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
