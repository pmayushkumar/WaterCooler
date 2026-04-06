import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  const { email, current_limit, how_many_more, reason, other_reason } = await request.json();

  if (!how_many_more || !reason) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    `INSERT INTO limit_increase_requests (email, current_limit, how_many_more, reason, other_reason)
     VALUES (?, ?, ?, ?, ?)`
  ).run(email || '', current_limit || 10, how_many_more, reason, other_reason || '');

  return NextResponse.json({ success: true });
}
