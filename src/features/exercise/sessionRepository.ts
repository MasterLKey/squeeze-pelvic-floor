import { eq, desc, gte, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { sessions } from '@/lib/db/schema';
import type { NewSession, Session } from '@/lib/db/schema';
import type { CompletedSession } from './types';
import type { SessionRating } from '@/lib/constants';

function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function saveSession(session: CompletedSession, userId?: string): Promise<Session> {
  const record: NewSession = {
    id:                   session.id || uuid(),
    userId:               userId ?? null,
    createdAt:            session.completedAt,
    completedAt:          session.completedAt,
    programId:            session.programId ?? null,
    week:                 session.week ?? null,
    day:                  session.day ?? null,
    exerciseType:         session.exerciseType,
    holdDuration:         session.holdDuration,
    restDuration:         session.restDuration,
    reps:                 session.reps,
    sets:                 session.sets,
    setsCompleted:        session.setsCompleted,
    totalSqueezeSeconds:  session.totalSqueezeSeconds,
    rating:               session.rating ?? null,
    syncedAt:             null,
  };
  const [saved] = await db.insert(sessions).values(record).returning();
  return saved;
}

export async function updateSessionRating(id: string, rating: SessionRating): Promise<void> {
  await db.update(sessions).set({ rating }).where(eq(sessions.id, id));
}

export async function getRecentSessions(limit = 30): Promise<Session[]> {
  return db.select().from(sessions).orderBy(desc(sessions.completedAt)).limit(limit);
}

export async function getTodaySessions(): Promise<Session[]> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return db
    .select()
    .from(sessions)
    .where(gte(sessions.completedAt, todayStart.toISOString()));
}

export async function getStreakData(): Promise<{ streak: number; lastSessionDate: string | null }> {
  const rows = await db
    .select({ date: sql<string>`date(completed_at)` })
    .from(sessions)
    .orderBy(desc(sessions.completedAt))
    .limit(100);

  if (rows.length === 0) return { streak: 0, lastSessionDate: null };

  const dates = [...new Set(rows.map((r) => r.date))];
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dates[0] !== today && dates[0] !== yesterday) {
    return { streak: 0, lastSessionDate: dates[0] ?? null };
  }

  let streak = 0;
  let cursor = new Date(dates[0]);
  for (const date of dates) {
    if (date === cursor.toISOString().split('T')[0]) {
      streak++;
      cursor = new Date(cursor.getTime() - 86400000);
    } else {
      break;
    }
  }

  return { streak, lastSessionDate: dates[0] ?? null };
}

export async function getWeeklyStats(): Promise<{ date: string; totalSeconds: number }[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  return db
    .select({
      date:         sql<string>`date(completed_at)`,
      totalSeconds: sql<number>`sum(total_squeeze_seconds)`,
    })
    .from(sessions)
    .where(gte(sessions.completedAt, sevenDaysAgo))
    .groupBy(sql`date(completed_at)`)
    .orderBy(sql`date(completed_at)`);
}

export async function getUnsyncedSessions(): Promise<Session[]> {
  return db
    .select()
    .from(sessions)
    .where(sql`synced_at IS NULL AND user_id IS NOT NULL`);
}

export async function markSessionSynced(id: string): Promise<void> {
  await db
    .update(sessions)
    .set({ syncedAt: new Date().toISOString() })
    .where(eq(sessions.id, id));
}
