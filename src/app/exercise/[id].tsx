import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SqueezeRing } from '@/components/ui/SqueezeRing';
import { Button } from '@/components/ui/Button';
import { useExercise } from '@/features/exercise/useExercise';
import { saveSession } from '@/features/exercise/sessionRepository';
import { sendSessionCompleteBadgeClear } from '@/features/reminders/notificationService';
import { useAuth } from '@/features/auth/useAuth';
import { EXERCISE_TYPES, SESSION_RATING } from '@/lib/constants';
import type { ExerciseType, SessionRating } from '@/lib/constants';
import type { ExerciseParams } from '@/features/exercise/types';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const PHASE_BG: Record<string, string> = {
  idle:          '#F9F7FF',
  prepare:       '#F5F3FF',
  squeeze:       '#F5F3FF',
  rest:          '#F0FDF9',
  between_sets:  '#FFFBEB',
  complete:      '#F0FDF9',
};

export default function ExerciseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    exerciseType: string;
    holdDuration: string;
    restDuration: string;
    reps: string;
    sets: string;
    programId?: string;
    week?: string;
    day?: string;
  }>();

  const { user } = useAuth();
  const [sessionId] = useState(uuid);
  const [ratingDone, setRatingDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const exerciseParams: ExerciseParams = {
    exerciseType:  (params.exerciseType ?? EXERCISE_TYPES.MIXED) as ExerciseType,
    holdDuration:  parseInt(params.holdDuration ?? '8', 10),
    restDuration:  parseInt(params.restDuration ?? '4', 10),
    reps:          parseInt(params.reps ?? '10', 10),
    sets:          parseInt(params.sets ?? '3', 10),
    programId:     params.programId,
    week:          params.week ? parseInt(params.week, 10) : undefined,
    day:           params.day  ? parseInt(params.day, 10)  : undefined,
  };

  const { state, start, pause, resume, stop } = useExercise(exerciseParams);

  const bgColor = PHASE_BG[state.phase] ?? '#F9F7FF';

  const handleClose = useCallback(() => {
    if (state.isRunning || (state.phase !== 'idle' && state.phase !== 'complete')) {
      Alert.alert(
        'End session?',
        'Your progress for this set will not be saved.',
        [
          { text: 'Keep going', style: 'cancel' },
          { text: 'End session', style: 'destructive', onPress: () => { stop(); router.back(); } },
        ],
      );
    } else {
      router.back();
    }
  }, [state.isRunning, state.phase, stop, router]);

  const handleRate = useCallback(async (rating: SessionRating) => {
    if (saving) return;
    setSaving(true);
    await saveSession(
      {
        id:                  sessionId,
        completedAt:         new Date().toISOString(),
        exerciseType:        exerciseParams.exerciseType,
        holdDuration:        exerciseParams.holdDuration,
        restDuration:        exerciseParams.restDuration,
        reps:                exerciseParams.reps,
        sets:                exerciseParams.sets,
        setsCompleted:       state.currentSet,
        totalSqueezeSeconds: state.totalSqueezeSeconds,
        programId:           exerciseParams.programId,
        week:                exerciseParams.week,
        day:                 exerciseParams.day,
        rating,
      },
      user?.id,
    );
    await sendSessionCompleteBadgeClear();
    setRatingDone(true);
    setSaving(false);
  }, [saving, sessionId, exerciseParams, state, user]);

  // Complete screen
  if (state.phase === 'complete' && !ratingDone) {
    return (
      <SafeAreaView className="flex-1 bg-green-50 items-center justify-center px-8">
        <Text className="text-6xl mb-4">🎉</Text>
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Session complete!</Text>
        <Text className="text-gray-500 text-sm mb-1">
          {state.currentSet} sets · {exerciseParams.reps} reps each
        </Text>
        <Text className="text-primary-600 font-bold text-lg mb-8">
          {Math.round(state.totalSqueezeSeconds)}s of squeeze time
        </Text>

        <Text className="text-gray-700 font-semibold text-base mb-4">How did it feel?</Text>
        <View className="w-full gap-3">
          {([
            { rating: SESSION_RATING.TOO_EASY,   label: '😊 Too easy', desc: "I'll push harder next time" },
            { rating: SESSION_RATING.JUST_RIGHT,  label: '✅ Just right', desc: 'Perfect level for me' },
            { rating: SESSION_RATING.TOO_HARD,    label: '😤 Tough', desc: "I'll ease off next time" },
          ] as const).map(({ rating, label, desc }) => (
            <TouchableOpacity
              key={rating}
              className="bg-white rounded-2xl p-4 border border-gray-100 active:bg-gray-50"
              onPress={() => handleRate(rating)}
              disabled={saving}
            >
              <Text className="text-gray-900 font-semibold text-base">{label}</Text>
              <Text className="text-gray-400 text-sm">{desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (ratingDone) {
    return (
      <SafeAreaView className="flex-1 bg-green-50 items-center justify-center px-8">
        <Text className="text-6xl mb-4">💪</Text>
        <Text className="text-2xl font-bold text-gray-900 mb-2">Saved!</Text>
        <Text className="text-gray-500 text-sm mb-8 text-center">
          Keep it up — consistency is everything with pelvic floor training.
        </Text>
        <Button title="Back to Home" variant="primary" size="lg" onPress={() => router.back()} className="w-full" />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 items-center" style={{ backgroundColor: bgColor }}>
      <SafeAreaView className="flex-1 w-full">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4">
          <TouchableOpacity onPress={handleClose} className="p-2 -ml-2">
            <Text className="text-gray-400 text-2xl">✕</Text>
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-gray-500 text-sm font-medium capitalize">
              {exerciseParams.exerciseType.replace('_', ' ')}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Ring */}
        <View className="flex-1 items-center justify-center">
          <SqueezeRing
            phase={state.phase}
            progress={state.progress}
            secondsLeft={state.secondsLeft}
            currentRep={state.currentRep}
            totalReps={exerciseParams.reps}
            currentSet={state.currentSet}
            totalSets={exerciseParams.sets}
          />

          {state.phase === 'between_sets' && (
            <View className="mt-4 px-6 py-3 bg-yellow-50 rounded-2xl">
              <Text className="text-yellow-700 font-semibold text-center">
                Rest before Set {state.currentSet + 1}
              </Text>
            </View>
          )}
        </View>

        {/* Controls */}
        <View className="px-8 pb-8 gap-3">
          {state.phase === 'idle' && (
            <Button title="Start" variant="primary" size="lg" onPress={start} className="w-full" />
          )}
          {state.isRunning && state.phase !== 'idle' && state.phase !== 'complete' && (
            <Button title="Pause" variant="secondary" size="lg" onPress={pause} className="w-full" />
          )}
          {!state.isRunning && state.phase !== 'idle' && state.phase !== 'complete' && (
            <View className="gap-3">
              <Button title="Resume" variant="primary" size="lg" onPress={resume} className="w-full" />
              <Button title="End session" variant="ghost" size="md" onPress={handleClose} className="w-full" />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
