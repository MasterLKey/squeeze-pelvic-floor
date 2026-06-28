import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  if (streak === 0) return null;

  return (
    <View className="flex-row items-center bg-orange-50 rounded-2xl px-3 py-1.5 gap-1">
      <Text className="text-lg">🔥</Text>
      <Text className="text-orange-600 font-bold text-sm">{streak} day{streak !== 1 ? 's' : ''}</Text>
    </View>
  );
}
