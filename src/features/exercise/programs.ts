import { EXERCISE_TYPES } from '@/lib/constants';
import type { Program } from './types';

export const PROGRAMS: Program[] = [
  {
    id: 'beginner-8week',
    name: 'Foundation',
    description: 'Build your pelvic floor strength from scratch. Perfect for beginners or those returning after a break.',
    difficulty: 'beginner',
    isPremium: false,
    weeks: [
      { week: 1, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.SLOW_HOLD, holdDuration: 4, restDuration: 4, reps: 8,  sets: 2, restDay: false })) },
      { week: 2, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.SLOW_HOLD, holdDuration: 5, restDuration: 4, reps: 8,  sets: 2, restDay: false })) },
      { week: 3, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.SLOW_HOLD, holdDuration: 6, restDuration: 4, reps: 10, sets: 2, restDay: false })) },
      { week: 4, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 6, restDuration: 4, reps: 10, sets: 2, restDay: false })) },
      { week: 5, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 7, restDuration: 4, reps: 10, sets: 3, restDay: false })) },
      { week: 6, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 8, restDuration: 4, reps: 10, sets: 3, restDay: false })) },
      { week: 7, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 8, restDuration: 3, reps: 12, sets: 3, restDay: false })) },
      { week: 8, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 10, restDuration: 3, reps: 12, sets: 3, restDay: false })) },
    ],
  },
  {
    id: 'intermediate-8week',
    name: 'Build & Hold',
    description: 'Increase endurance and strength with longer holds and mixed techniques.',
    difficulty: 'intermediate',
    isPremium: true,
    weeks: [
      { week: 1, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 8,  restDuration: 4, reps: 10, sets: 3, restDay: false })) },
      { week: 2, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 10, restDuration: 4, reps: 10, sets: 3, restDay: false })) },
      { week: 3, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 10, restDuration: 3, reps: 12, sets: 3, restDay: false })) },
      { week: 4, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.SLOW_HOLD, holdDuration: 12, restDuration: 4, reps: 10, sets: 3, restDay: false })) },
      { week: 5, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 12, restDuration: 3, reps: 12, sets: 4, restDay: false })) },
      { week: 6, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 12, restDuration: 3, reps: 12, sets: 4, restDay: false })) },
      { week: 7, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 15, restDuration: 3, reps: 12, sets: 4, restDay: false })) },
      { week: 8, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,     holdDuration: 15, restDuration: 3, reps: 15, sets: 4, restDay: false })) },
    ],
  },
  {
    id: 'advanced-8week',
    name: 'Power Floor',
    description: 'High-intensity training for those with a solid foundation looking to maximise strength.',
    difficulty: 'advanced',
    isPremium: true,
    weeks: [
      { week: 1, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,       holdDuration: 12, restDuration: 3, reps: 15, sets: 4, restDay: false })) },
      { week: 2, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,       holdDuration: 15, restDuration: 3, reps: 15, sets: 4, restDay: false })) },
      { week: 3, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.SLOW_HOLD,   holdDuration: 15, restDuration: 3, reps: 15, sets: 5, restDay: false })) },
      { week: 4, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,       holdDuration: 15, restDuration: 2, reps: 15, sets: 5, restDay: false })) },
      { week: 5, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,       holdDuration: 20, restDuration: 3, reps: 15, sets: 5, restDay: false })) },
      { week: 6, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.QUICK_FLICK, holdDuration: 1,  restDuration: 1, reps: 30, sets: 5, restDay: false })) },
      { week: 7, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,       holdDuration: 20, restDuration: 2, reps: 15, sets: 5, restDay: false })) },
      { week: 8, days: Array.from({ length: 5 }, (_, i) => ({ day: i + 1, exerciseType: EXERCISE_TYPES.MIXED,       holdDuration: 20, restDuration: 2, reps: 20, sets: 5, restDay: false })) },
    ],
  },
];

export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export function getProgramDay(program: Program, week: number, day: number) {
  return program.weeks.find((w) => w.week === week)?.days.find((d) => d.day === day);
}
