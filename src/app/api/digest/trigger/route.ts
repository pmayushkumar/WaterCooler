import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateDigestForUser } from '@/lib/digest/per-user';
import type { User } from '@/types';

/** Trigger digest for a single user (used for first-colleague instant digest) */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization') || '';
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { user_id } = await request.json();

  if (!user_id) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(user_id) as User | undefined;

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    await generateDigestForUser(user);
    return NextResponse.json({ status: 'success', user_email: user.email });
  } catch (err) {
    console.error('[digest/trigger] Error:', err);
    return NextResponse.json({ error: 'Digest generation failed' }, { status: 500 });
  }
}
