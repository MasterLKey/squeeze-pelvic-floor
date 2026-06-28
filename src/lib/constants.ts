export const APP_NAME = 'Squeeze';

export const EXERCISE_TYPES = {
  SLOW_HOLD: 'slow_hold',
  QUICK_FLICK: 'quick_flick',
  MIXED: 'mixed',
} as const;

export type ExerciseType = (typeof EXERCISE_TYPES)[keyof typeof EXERCISE_TYPES];

export const DIFFICULTY_LEVELS = {
  BEGINNER:     'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED:     'advanced',
} as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];

export const SESSION_RATING = {
  TOO_EASY:    'too_easy',
  JUST_RIGHT:  'just_right',
  TOO_HARD:    'too_hard',
} as const;

export type SessionRating = (typeof SESSION_RATING)[keyof typeof SESSION_RATING];

export const NOTIFICATION_CHANNELS = {
  REMINDERS: 'squeeze-reminders',
} as const;

export const MMKV_KEYS = {
  ONBOARDING_COMPLETE:  'onboarding_complete',
  USER_GOAL:            'user_goal',
  ACTIVE_PROGRAM_ID:    'active_program_id',
  CURRENT_WEEK:         'current_week',
  CURRENT_DAY:          'current_day',
  STREAK:               'streak',
  LAST_SESSION_DATE:    'last_session_date',
  REMINDER_TIMES:       'reminder_times',
  REMINDERS_ENABLED:    'reminders_enabled',
  HAPTICS_ENABLED:      'haptics_enabled',
  AUDIO_CUES_ENABLED:   'audio_cues_enabled',
  THEME:                'theme',
  USER_ID:              'user_id',
} as const;

export const DEFAULT_EXERCISE_PARAMS = {
  holdDuration:  8,
  restDuration:  4,
  reps:          10,
  sets:          3,
} as const;

export const COLORS = {
  primary:      '#8B5CF6',
  primaryLight: '#C4B5FD',
  primaryDark:  '#6D28D9',
  rest:         '#E5E7EB',
  success:      '#10B981',
  warning:      '#F59E0B',
  error:        '#EF4444',
  bg:           '#F9F7FF',
  surface:      '#FFFFFF',
  textPrimary:  '#111827',
  textSecondary:'#6B7280',
} as const;
