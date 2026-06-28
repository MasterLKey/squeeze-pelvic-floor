import type { ExerciseType, SessionRating } from '@/lib/constants';

export interface ExerciseParams {
  exerciseType:  ExerciseType;
  holdDuration:  number;
  restDuration:  number;
  reps:          number;
  sets:          number;
  programId?:    string;
  week?:         number;
  day?:          number;
}

export type ExercisePhase = 'idle' | 'prepare' | 'squeeze' | 'rest' | 'between_sets' | 'complete';

export interface ExerciseState {
  phase:          ExercisePhase;
  currentSet:     number;
  currentRep:     number;
  secondsLeft:    number;
  progress:       number;
  isRunning:      boolean;
  totalSqueezeSeconds: number;
}

export interface CompletedSession {
  id:                   string;
  completedAt:          string;
  exerciseType:         ExerciseType;
  holdDuration:         number;
  restDuration:         number;
  reps:                 number;
  sets:                 number;
  setsCompleted:        number;
  totalSqueezeSeconds:  number;
  programId?:           string;
  week?:                number;
  day?:                 number;
  rating?:              SessionRating;
}

export interface Program {
  id:          string;
  name:        string;
  description: string;
  difficulty:  'beginner' | 'intermediate' | 'advanced';
  weeks:       ProgramWeek[];
  isPremium:   boolean;
}

export interface ProgramWeek {
  week:  number;
  days:  ProgramDay[];
}

export interface ProgramDay {
  day:           number;
  exerciseType:  ExerciseType;
  holdDuration:  number;
  restDuration:  number;
  reps:          number;
  sets:          number;
  restDay?:      boolean;
}
