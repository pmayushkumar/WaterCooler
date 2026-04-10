import { getDb } from '@/lib/db';
import { generateDigestForUser } from './per-user';
import type { User } from '@/types';

/** Run the weekly digest for all users. Errors are isolated per user. */
export async function runWeeklyDigest(): Promise<{
  total: number;
  success: number;
  failed: number;
}> {
  const db = getDb();
  const users = db.prepare('SELECT * FROM users').all() as User[];

  console.log(`[digest] Starting weekly digest for ${users.length} users`);

  let success = 0;
  let failed = 0;

  for (const user of users) {
    try {
      await generateDigestForUser(user);
      success++;
    } catch (err) {
      console.error(`[digest] Failed for user ${user.email}:`, err);
      failed++;
    }
  }

  console.log(`[digest] Complete: ${success} success, ${failed} failed out of ${users.length}`);

  return { total: users.length, success, failed };
}
