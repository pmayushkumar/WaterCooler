import { NextRequest, NextResponse } from 'next/server';
import { runWeeklyDigest } from '@/lib/digest/orchestrator';

/** Cron endpoint: runs the weekly digest for all users */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization') || '';
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runWeeklyDigest();
    return NextResponse.json(result);
  } catch (err) {
    console.error('[digest/cron] Error:', err);
    return NextResponse.json({ error: 'Digest run failed' }, { status: 500 });
  }
}
