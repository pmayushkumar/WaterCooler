import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { validateRequest } from '@/lib/auth';
import type { Colleague } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get('token') || '';
  const userId = request.nextUrl.searchParams.get('user_id') || '';

  const auth = validateRequest(token, userId, id);
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  return NextResponse.json(auth.colleague);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.headers.get('X-Token') || '';
  const body = await request.json();
  const userId = body.user_id || '';

  const auth = validateRequest(token, userId, id);
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const db = getDb();
  db.prepare(
    `UPDATE colleagues SET
       name = ?, grew_up_places = ?, current_city = ?, current_country = ?,
       family_info = ?, hobbies = ?, preference_type = ?, sports_detail = ?, notes = ?
     WHERE colleague_id = ?`
  ).run(
    body.name?.trim() || auth.colleague.name,
    body.grew_up_places ?? auth.colleague.grew_up_places,
    body.current_city ?? auth.colleague.current_city,
    body.current_country ?? auth.colleague.current_country,
    body.family_info ?? auth.colleague.family_info,
    body.hobbies ?? auth.colleague.hobbies,
    body.preference_type ?? auth.colleague.preference_type,
    body.sports_detail ?? auth.colleague.sports_detail,
    body.notes ?? auth.colleague.notes,
    id
  );

  const updated = db
    .prepare('SELECT * FROM colleagues WHERE colleague_id = ?')
    .get(id) as Colleague;

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get('token') || '';
  const userId = request.nextUrl.searchParams.get('user_id') || '';

  const auth = validateRequest(token, userId, id);
  if (!auth.valid) {
    return NextResponse.json({ error: auth.error }, { status: 403 });
  }

  const db = getDb();
  db.prepare('DELETE FROM colleagues WHERE colleague_id = ?').run(id);

  return NextResponse.json({ deleted: true, colleague_id: id });
}
