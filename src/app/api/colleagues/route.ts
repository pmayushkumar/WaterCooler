import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateColleagueId } from '@/lib/ids';
import { getMaxConnections } from '@/lib/config';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    user_id,
    name,
    grew_up_places,
    current_city,
    current_country,
    family_info,
    hobbies,
    preference_type,
    sports_detail,
    notes,
  } = body;

  if (!user_id || !name?.trim()) {
    return NextResponse.json({ error: 'user_id and name are required' }, { status: 400 });
  }

  const db = getDb();

  // Verify user exists
  const user = db.prepare('SELECT user_id FROM users WHERE user_id = ?').get(user_id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Re-check limit server-side (prevents race conditions)
  const countResult = db
    .prepare('SELECT COUNT(*) as count FROM colleagues WHERE user_id = ?')
    .get(user_id) as { count: number };

  const maxConnections = getMaxConnections();
  if (countResult.count >= maxConnections) {
    return NextResponse.json(
      { error: `Connection limit reached (${maxConnections}). Remove a colleague first.` },
      { status: 429 }
    );
  }

  const colleagueId = generateColleagueId();

  db.prepare(
    `INSERT INTO colleagues (colleague_id, user_id, name, grew_up_places, current_city, current_country, family_info, hobbies, preference_type, sports_detail, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    colleagueId,
    user_id,
    name.trim(),
    grew_up_places || '',
    current_city || '',
    current_country || '',
    family_info || '',
    hobbies || '',
    preference_type || 'culture',
    sports_detail || '',
    notes || ''
  );

  return NextResponse.json({ colleague_id: colleagueId });
}
