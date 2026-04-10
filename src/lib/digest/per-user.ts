import { getDb } from '@/lib/db';
import { buildSearchQueries } from './search-queries';
import { executeSearches } from './serp';
import { buildGeminiPrompt } from './prompt';
import { callGemini, generateFallbackDigest, validateColleagueIds } from './gemini';
import { buildDigestEmail } from '@/lib/email/digest-template';
import { sendEmail } from '@/lib/email/resend';
import type { User, Colleague, ColleagueSearchResults } from '@/types';

/** Generate and send a digest email for a single user */
export async function generateDigestForUser(user: User): Promise<void> {
  const db = getDb();
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const serpApiKey = process.env.SERPAPI_KEY || '';

  // 1. Fetch user's colleagues
  const colleagues = db
    .prepare('SELECT * FROM colleagues WHERE user_id = ?')
    .all(user.user_id) as Colleague[];

  // Skip if no colleagues
  if (colleagues.length === 0) {
    console.log(`[digest] Skipping ${user.email}: 0 colleagues`);
    return;
  }

  console.log(`[digest] Processing ${user.email}: ${colleagues.length} colleagues`);

  // 2. Build search queries and execute searches for each colleague
  const allSearchResults: ColleagueSearchResults[] = [];

  for (const col of colleagues) {
    const queries = buildSearchQueries(col);

    let results: import('@/types').SearchResult[] = [];
    if (serpApiKey) {
      results = await executeSearches(queries, serpApiKey);
    } else {
      console.log(`[digest] No SERPAPI_KEY — skipping searches for ${col.name}`);
    }

    allSearchResults.push({
      colleague_id: col.colleague_id,
      colleague_name: col.name,
      results,
    });
  }

  // 3. Build prompt and call Gemini (with fallback)
  let digest;
  try {
    const prompt = buildGeminiPrompt(user, colleagues, allSearchResults);
    digest = await callGemini(prompt);
    digest = validateColleagueIds(digest, colleagues);
  } catch (err) {
    console.error(`[digest] Gemini failed for ${user.email}:`, err);
    digest = generateFallbackDigest(colleagues);
  }

  // 4. Build email
  const { subject, html } = buildDigestEmail(user, digest, baseUrl);

  // 5. Send email and log
  let emailId = '';
  let status = 'success';

  try {
    const result = await sendEmail({ to: user.email, subject, html });
    emailId = result.id;
  } catch (err) {
    console.error(`[digest] Send failed for ${user.email}:`, err);
    status = 'error';
  }

  // 6. Log to digest_log
  db.prepare(
    `INSERT INTO digest_log (user_email, user_name, colleagues_count, colleague_names, status, email_id)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    user.email,
    user.name,
    colleagues.length,
    colleagues.map((c) => c.name).join(', '),
    status,
    emailId
  );

  console.log(`[digest] ${status} for ${user.email} (${colleagues.length} colleagues, email_id: ${emailId})`);
}
