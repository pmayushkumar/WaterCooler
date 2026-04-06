import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  const { email, rating, suggestions } = await request.json();

  if (!rating) {
    return NextResponse.json({ error: 'Rating is required' }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    'INSERT INTO feedback (email, rating, suggestions) VALUES (?, ?, ?)'
  ).run(email || '', rating, suggestions || '');

  return NextResponse.json({ success: true });
}
