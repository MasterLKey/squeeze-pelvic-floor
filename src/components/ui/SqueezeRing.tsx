import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/lib/constants';
import type { ExercisePhase } from '@/features/exercise/types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE        = 260;
const STROKE      = 18;
const RADIUS      = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  phase:       ExercisePhase;
  progress:    number;
  secondsLeft: number;
  currentRep:  number;
  totalReps:   number;
  currentSet:  number;
  totalSets:   number;
}

const PHASE_LABELS: Record<ExercisePhase, string> = {
  idle:          'Ready',
  prepare:       'Get Ready',
  squeeze:       'SQUEEZE',
  rest:          'Relax',
  between_sets:  'Rest',
  complete:      'Done!',
};

const PHASE_COLORS: Record<ExercisePhase, string> = {
  idle:          COLORS.rest,
  prepare:       COLORS.primaryLight,
  squeeze:       COLORS.primary,
  rest:          '#10B981',
  between_sets:  '#F59E0B',
  complete:      '#10B981',
};

export function SqueezeRing({
  phase,
  progress,
  secondsLeft,
  currentRep,
  totalReps,
  currentSet,
  totalSets,
}: Props) {
  const animProgress = useSharedValue(0);
  const scale        = useSharedValue(1);

  useEffect(() => {
    animProgress.value = withTiming(progress, {
      duration: 900,
      easing:   Easing.out(Easing.quad),
    });
  }, [progress]);

  useEffect(() => {
    if (phase === 'squeeze') {
      scale.value = withTiming(1.04, { duration: 300 });
    } else {
      scale.value = withTiming(1, { duration: 300 });
    }
  }, [phase]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - animProgress.value),
  }));

  const ringColor = PHASE_COLORS[phase] ?? COLORS.primary;

  return (
    <View className="items-center justify-center">
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* background track */}
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={COLORS.rest}
          strokeWidth={STROKE}
          fill="none"
        />
        {/* progress arc */}
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={ringColor}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          animatedProps={animatedCircleProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>

      {/* centre content */}
      <View className="absolute items-center justify-center">
        <Text
          className="text-5xl font-bold text-gray-900"
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {phase === 'idle' || phase === 'complete' ? '' : secondsLeft}
        </Text>
        <Text className="text-lg font-semibold mt-1" style={{ color: ringColor }}>
          {PHASE_LABELS[phase]}
        </Text>
        {phase !== 'idle' && phase !== 'complete' && phase !== 'prepare' && (
          <Text className="text-sm text-gray-400 mt-1">
            Rep {currentRep}/{totalReps} · Set {currentSet}/{totalSets}
          </Text>
        )}
      </View>
    </View>
  );
}
