import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, RefreshControl } from 'react-native';
import { getRecentSessions, getStreakData } from '@/features/exercise/sessionRepository';
import { SessionCard } from '@/components/ui/SessionCard';
import { Card } from '@/components/ui/Card';
import type { Session } from '@/lib/db/schema';

interface Stats { streak: number; lastSessionDate: string | null }

export default function HistoryScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats>({ streak: 0, lastSessionDate: null });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [s, data] = await Promise.all([getStreakData(), getRecentSessions(50)]);
    setStats(s);
    setSessions(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const totalSqueeze = sessions.reduce((acc, s) => acc + s.totalSqueezeSeconds, 0);
  const totalMins = Math.floor(totalSqueeze / 60);

  return (
    <SafeAreaView className="flex-1 bg-squeeze-bg">
      <FlatList
        data={sessions}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B5CF6" />}
        ListHeaderComponent={() => (
          <View>
            <Text className="text-2xl font-bold text-gray-900 mt-6 mb-4">Your History</Text>

            {/* Stats row */}
            <View className="flex-row gap-3 mb-6">
              <Card className="flex-1 items-center py-4">
                <Text className="text-3xl font-bold text-primary-600">{stats.streak}</Text>
                <Text className="text-gray-400 text-xs mt-1">Day Streak 🔥</Text>
              </Card>
              <Card className="flex-1 items-center py-4">
                <Text className="text-3xl font-bold text-primary-600">{sessions.length}</Text>
                <Text className="text-gray-400 text-xs mt-1">Sessions</Text>
              </Card>
              <Card className="flex-1 items-center py-4">
                <Text className="text-3xl font-bold text-primary-600">{totalMins}</Text>
                <Text className="text-gray-400 text-xs mt-1">Minutes Total</Text>
              </Card>
            </View>

            {sessions.length > 0 && (
              <Text className="text-gray-500 font-semibold text-sm mb-3 uppercase tracking-wide">
                All Sessions
              </Text>
            )}
          </View>
        )}
        renderItem={({ item }) => <SessionCard session={item} />}
        ListEmptyComponent={() => (
          <Card className="items-center py-12 mt-4">
            <Text className="text-5xl mb-4">📋</Text>
            <Text className="text-gray-900 font-semibold text-base mb-2">No sessions yet</Text>
            <Text className="text-gray-400 text-sm text-center">
              Complete your first session on the Today tab to see it here.
            </Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
