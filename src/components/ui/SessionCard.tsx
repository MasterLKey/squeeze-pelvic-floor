import React from 'react';
import { View, Text } from 'react-native';
import { Card } from './Card';
import type { Session } from '@/lib/db/schema';

interface Props {
  session: Session;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
  });
}

const TYPE_LABELS: Record<string, string> = {
  slow_hold:   'Slow Hold',
  quick_flick: 'Quick Flick',
  mixed:       'Mixed',
};

const RATING_LABELS: Record<string, string> = {
  too_easy:   '😊 Too easy',
  just_right: '✅ Just right',
  too_hard:   '😤 Tough',
};

export function SessionCard({ session }: Props) {
  return (
    <Card className="mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold text-base">
            {TYPE_LABELS[session.exerciseType] ?? session.exerciseType}
          </Text>
          <Text className="text-gray-400 text-sm mt-0.5">{formatDate(session.completedAt)}</Text>
        </View>
        <View className="items-end gap-1">
          <Text className="text-primary-600 font-bold text-base">
            {formatDuration(session.totalSqueezeSeconds)}
          </Text>
          <Text className="text-gray-400 text-xs">
            {session.setsCompleted} sets · {session.reps} reps
          </Text>
        </View>
      </View>
      {session.rating && (
        <View className="mt-2 pt-2 border-t border-gray-50">
          <Text className="text-sm text-gray-400">{RATING_LABELS[session.rating] ?? session.rating}</Text>
        </View>
      )}
    </Card>
  );
}
