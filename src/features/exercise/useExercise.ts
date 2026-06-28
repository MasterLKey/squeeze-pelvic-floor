import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { getBool } from '@/lib/mmkv';
import { MMKV_KEYS, EXERCISE_TYPES } from '@/lib/constants';
import type { ExerciseParams, ExerciseState, ExercisePhase } from './types';

const PREPARE_SECONDS = 3;

interface UseExerciseReturn {
  state:    ExerciseState;
  start:    () => void;
  pause:    () => void;
  resume:   () => void;
  stop:     () => void;
}

export function useExercise(params: ExerciseParams): UseExerciseReturn {
  const { holdDuration, restDuration, reps, sets, exerciseType } = params;
  const hapticsEnabled = getBool(MMKV_KEYS.HAPTICS_ENABLED, true);

  const [state, setState] = useState<ExerciseState>({
    phase:               'idle',
    currentSet:          1,
    currentRep:          0,
    secondsLeft:         0,
    progress:            0,
    isRunning:           false,
    totalSqueezeSeconds: 0,
  });

  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef     = useRef(state);
  const paramsRef    = useRef(params);

  stateRef.current  = state;
  paramsRef.current = params;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const hapticHeavy = useCallback(() => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [hapticsEnabled]);

  const hapticLight = useCallback(() => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [hapticsEnabled]);

  const tick = useCallback(() => {
    setState((prev) => {
      const next = { ...prev };

      if (next.phase === 'prepare') {
        if (next.secondsLeft <= 1) {
          hapticHeavy();
          return {
            ...next,
            phase:      'squeeze',
            secondsLeft: holdDuration,
            currentRep:  1,
            progress:    0,
          };
        }
        return { ...next, secondsLeft: next.secondsLeft - 1 };
      }

      if (next.phase === 'squeeze') {
        const elapsed  = holdDuration - next.secondsLeft + 1;
        const progress = elapsed / holdDuration;
        const squeeze  = next.exerciseTypeIsQuick ? 1 : holdDuration;
        const totalSqueeze = next.totalSqueezeSeconds + 1;

        if (next.secondsLeft <= 1) {
          hapticLight();
          const isLastRepInSet = next.currentRep >= reps;
          if (isLastRepInSet) {
            const isLastSet = next.currentSet >= sets;
            if (isLastSet) {
              return {
                ...next,
                phase:               'complete',
                progress:            1,
                isRunning:           false,
                totalSqueezeSeconds: totalSqueeze,
              };
            }
            return {
              ...next,
              phase:               'between_sets',
              secondsLeft:         15,
              progress:            0,
              totalSqueezeSeconds: totalSqueeze,
            };
          }
          return {
            ...next,
            phase:               'rest',
            secondsLeft:         restDuration,
            progress:            0,
            currentRep:          next.currentRep + 1,
            totalSqueezeSeconds: totalSqueeze,
          };
        }
        return {
          ...next,
          secondsLeft:         next.secondsLeft - 1,
          progress,
          totalSqueezeSeconds: totalSqueeze,
        };
      }

      if (next.phase === 'rest') {
        if (next.secondsLeft <= 1) {
          hapticHeavy();
          return {
            ...next,
            phase:      'squeeze',
            secondsLeft: holdDuration,
            progress:    0,
          };
        }
        return { ...next, secondsLeft: next.secondsLeft - 1 };
      }

      if (next.phase === 'between_sets') {
        if (next.secondsLeft <= 1) {
          hapticHeavy();
          return {
            ...next,
            phase:      'squeeze',
            secondsLeft: holdDuration,
            currentSet:  next.currentSet + 1,
            currentRep:  1,
            progress:    0,
          };
        }
        return { ...next, secondsLeft: next.secondsLeft - 1 };
      }

      return next;
    });
  }, [holdDuration, restDuration, reps, sets, hapticHeavy, hapticLight]);

  const start = useCallback(() => {
    const isQuick = exerciseType === EXERCISE_TYPES.QUICK_FLICK;
    setState({
      phase:               'prepare',
      currentSet:          1,
      currentRep:          0,
      secondsLeft:         PREPARE_SECONDS,
      progress:            0,
      isRunning:           true,
      totalSqueezeSeconds: 0,
      exerciseTypeIsQuick: isQuick,
    } as ExerciseState & { exerciseTypeIsQuick: boolean });
    intervalRef.current = setInterval(tick, 1000);
  }, [exerciseType, tick]);

  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, isRunning: false }));
  }, [clearTimer]);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true }));
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  const stop = useCallback(() => {
    clearTimer();
    setState({
      phase:               'idle',
      currentSet:          1,
      currentRep:          0,
      secondsLeft:         0,
      progress:            0,
      isRunning:           false,
      totalSqueezeSeconds: 0,
    });
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return { state, start, pause, resume, stop };
}
