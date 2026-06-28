import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const sessions = sqliteTable('sessions', {
  id:                   text('id').primaryKey(),
  userId:               text('user_id'),
  createdAt:            text('created_at').notNull(),
  completedAt:          text('completed_at').notNull(),
  programId:            text('program_id'),
  week:                 integer('week'),
  day:                  integer('day'),
  exerciseType:         text('exercise_type').notNull(),
  holdDuration:         integer('hold_duration').notNull(),
  restDuration:         integer('rest_duration').notNull(),
  reps:                 integer('reps').notNull(),
  sets:                 integer('sets').notNull(),
  setsCompleted:        integer('sets_completed').notNull(),
  totalSqueezeSeconds:  real('total_squeeze_seconds').notNull(),
  rating:               text('rating'),
  syncedAt:             text('synced_at'),
});

export const reminderTimes = sqliteTable('reminder_times', {
  id:      text('id').primaryKey(),
  hour:    integer('hour').notNull(),
  minute:  integer('minute').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  label:   text('label'),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type ReminderTime = typeof reminderTimes.$inferSelect;
export type NewReminderTime = typeof reminderTimes.$inferInsert;
