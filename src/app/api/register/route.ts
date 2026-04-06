import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateUserId, generateSecretToken } from '@/lib/ids';
import { normalizeEmail } from '@/lib/sanitize';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, grew_up_places, current_city, current_country } = body;

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  const normalizedEmail = normalizeEmail(email);
  const db = getDb();

  // Check for duplicate email
  const existing = db
    .prepare('SELECT user_id FROM users WHERE email = ?')
    .get(normalizedEmail);

  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
  }

  const userId = generateUserId();
  const secretToken = generateSecretToken();

  db.prepare(
    `INSERT INTO users (user_id, name, email, grew_up_places, current_city, current_country, secret_token)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(userId, name.trim(), normalizedEmail, grew_up_places || '', current_city || '', current_country || '', secretToken);

  return NextResponse.json({ user_id: userId, email: normalizedEmail });
}