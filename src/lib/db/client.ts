import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const sqliteDb = SQLite.openDatabaseSync('squeeze.db');

export const db = drizzle(sqliteDb, { schema });

export async function runMigrations() {
  await sqliteDb.execAsync(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT,
      created_at TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      program_id TEXT,
      week INTEGER,
      day INTEGER,
      exercise_type TEXT NOT NULL,
      hold_duration INTEGER NOT NULL,
      rest_duration INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      sets_completed INTEGER NOT NULL,
      total_squeeze_seconds REAL NOT NULL,
      rating TEXT,
      synced_at TEXT
    );

    CREATE TABLE IF NOT EXISTS reminder_times (
      id TEXT PRIMARY KEY NOT NULL,
      hour INTEGER NOT NULL,
      minute INTEGER NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      label TEXT
    );
  `);
}
