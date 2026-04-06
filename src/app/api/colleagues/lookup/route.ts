import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getMaxConnections } from '@/lib/config';
import { normalizeEmail } from '@/lib/sanitize';
import type { User } from '@/types';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const db = getDb();
  const normalizedEmail = normalizeEmail(email);

  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(normalizedEmail) as User | undefined;

  if (!user) {
    return NextResponse.json({ error: 'No account found with this email. Please register first.' }, { status: 404 });
  }

  const countResult = db
    .prepare('SELECT COUNT(*) as count FROM colleagues WHERE user_id = ?')
    .get(user.user_id) as { count: number };

  const maxConnections = getMaxConnections();

  return NextResponse.json({
    user_id: user.user_id,
    user_name: user.name,
    current_count: countResult.count,
    max_connections: maxConnections,
    limit_reached: countResult.count >= maxConnections,
  });
}
